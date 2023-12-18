import { useEffect, useState } from "react";
import ExplorerDetailHeader from "./ExplorerDetailHeader"
import HistoryList from "./HistoryList";
import { useNavigate, useParams } from "react-router-dom";
// import { useRequest } from "ahooks";
import inscriptionsApi from "@/utils/request";
import { Modal, message } from "antd";
import { ExplorerDataProps } from "@/utils/request.type";

let instance: ReturnType<typeof Modal.error> | undefined;

const ExplorerDetail = () => {

    useEffect(() => {
        window.scrollTo({
            top: 0
        })
    }, [])

    const [detail, setDetail] = useState<ExplorerDataProps>({} as ExplorerDataProps)

    const param = useParams()

    const nav = useNavigate()

    const getDetail = async () => {
        inscriptionsApi.getInscriptionsDetail({
            tick_hash: param.id,
            page: 1
        }).then((res) => {
            if (res.code === 0 && res.data.list.length > 0) {
                setDetail(res.data.list[0])
            } else {
                if (instance === undefined) {
                    instance = Modal.error({
                        title: 'Error!',
                        content: "No data found",
                        okText: "Back",
                        wrapClassName: "alert-model-wrap",
                        onOk() {
                            instance = undefined;
                            nav('/inscriptions/explorer')
                        },
                    });
                }
            }
        }).catch(err => {
            console.log(err, 'err')
        })
        // inscriptionsApi.getInscriptionsDetail(param.id as string).then(detail => {
        //     if (detail.data && detail.data.length > 0) {
        //         setDetail(detail.data[0])
        //     } else {
        //         // cancel()

        // });
    }

    // const { run, cancel } = useRequest(getDetail, requestTimeConfig);


    useEffect(() => {
        const hash = param.id;
        if (hash?.startsWith('0x')) {
            getDetail()
        } else {
            message.error("address error")
        }
    }, [param.id])

    return <div className="w-full mt-[32px]">
        <ExplorerDetailHeader detail={detail} />
        <HistoryList detail={detail} />
    </div>
}

export default ExplorerDetail;