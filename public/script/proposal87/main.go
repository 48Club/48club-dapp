package main

import (
	"context"
	"encoding/json"
	"math/big"
	"net/http"
	"os"

	mapset "github.com/deckarep/golang-set/v2"
	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

var (
	bn      *big.Int       = big.NewInt(35_348_488)
	koge    common.Address = common.HexToAddress("0xe6df05ce8c8301223373cf5b969afcb1498c5528")
	nft     common.Address = common.HexToAddress("0x57b81c140bdfd35dbfbb395360a66d54a650666d")
	balance common.Address = common.HexToAddress("0x545856e558eaeb4f58e1bbf9fd0ed7b3cca2bcdc")
	api     string         = os.Getenv("DB_API")
)

func main() {
	ec, err := ethclient.Dial("/opt/bsc/tmp/pbss/geth.ipc")
	if err != nil {
		panic(err)
	}
	defer ec.Close()

	addresss := mapset.NewSet[common.Address]()
	result := mapset.NewSet[common.Address]()
	{
		// 列出 nft 所有持有者
		totalSupply, err := ec.CallContract(context.Background(), ethereum.CallMsg{
			From: common.HexToAddress("0x0"),
			To:   &nft,
			Data: crypto.Keccak256([]byte("totalSupply()"))[:4],
		}, bn)
		if err != nil {
			panic(err)
		}

		for i := common.Big0.SetBytes(totalSupply).Int64() - 1; i >= 0; i-- {
			ownerOf, err := ec.CallContract(context.Background(), ethereum.CallMsg{
				From: common.HexToAddress("0x0"),
				To:   &nft,
				Data: append(crypto.Keccak256([]byte("ownerOf(uint256)"))[:4], common.BigToHash(big.NewInt(i)).Bytes()...),
			}, bn)
			if err != nil {
				panic(err)
			}

			addresss.Add(common.BytesToAddress(ownerOf))
		}
	}
	{
		// 列出 koge 全部收入地址
		logs, err := ec.FilterLogs(context.Background(), ethereum.FilterQuery{
			FromBlock: big.NewInt(646_649),
			ToBlock:   bn,
			Addresses: []common.Address{koge},
			Topics:    [][]common.Hash{{crypto.Keccak256Hash([]byte("Transfer(address,address,uint256)"))}},
		})
		if err != nil {
			panic(err)
		}

		for _, v := range logs {
			addresss.Add(common.BytesToAddress(v.Topics[2].Bytes()))
		}
	}
	{
		// 查询 balance 全部全部地址持仓
		for _, v := range addresss.ToSlice() {
			b, err := ec.CallContract(context.Background(), ethereum.CallMsg{
				From: common.HexToAddress("0x0"),
				To:   &balance,
				Data: append(crypto.Keccak256([]byte("getBalance(address)"))[:4], common.BytesToHash(v.Bytes()).Bytes()...),
			}, bn)
			if err != nil {
				panic(err)
			}
			if big.NewInt(500).Cmp(common.Big0.SetBytes(b)) <= 0 {
				result.Add(v)
			}
		}
	}
	{
		// 检查 tg 铂金会员资格列表
		platinums := []struct {
			ID         int64 `json:"id"`
			UID        int64 `json:"uid"`
			LockedKoge int64 `json:"lockedkoge"`
		}{}
		bscs := []struct {
			UID     int64  `json:"uid"`
			Address string `json:"address"`
			Ts      int64  `json:"ts"`
		}{}
		if err := getApi("/platinum", &platinums); err != nil {
			panic(err)
		}
		if err := getApi("/bsc", &bscs); err != nil {
			panic(err)
		}
		bscsMap := map[int64]string{}
		for _, v := range bscs {
			bscsMap[v.UID] = v.Address
		}
		for _, v := range platinums {
			if address, ok := bscsMap[v.UID]; ok && v.LockedKoge > 0 {
				result.Add(common.HexToAddress(address))
			}
		}
	}

	b, _ := json.Marshal(result.ToSlice())
	_ = os.WriteFile("result.json", b, 0644)
}

func init() {
	if api == "" {
		panic("no api url")
	}
}

func getApi(path string, i interface{}) error {
	response, err := http.Get(api + path)
	if err != nil {
		return err
	}
	defer response.Body.Close()
	return json.NewDecoder(response.Body).Decode(i)
}
