import { Row, Col } from "antd";
import acidIcon from '@/assets/images/acid.svg'

const Marketplace = () => {

    return <div className="pt-[55px] md:pt-[95px]">
        <h1 className="font-Rowdies my-0 text-[24px] md:text-[44px] w-[200px] mx-auto md:w-full leading-[25px] text-[#1E1E1E] text-center">Third Party Marketplace</h1>
        <p className="mt-[14px] md:mt-[40px] md:w-full w-[240px] mx-auto text-center text-[12px] md:text-[14px] leading-[14px] text-[#1E1E1E]">All marketplaces are developed by third-party partners.</p>
        <div className="w-full h-[170px] md:h-[325px] relative mt-[-20px] md:mt-[-14px]">
            <div className="w-[100vw] h-full absolute bg-line-market left-[50%] translate-x-[-50%]"></div>
        </div>
        <div className="w-full -mt-[60px]">
            <Row gutter={[24, 24]}>
                <Col span={24} md={{span: 8}}>
                    <div onClick={() => window.open("https://evms.app")} className="w-full md:hover:border-[#FFC801] border-[2px] border-transparent transition-colors cursor-pointer flex items-center px-[14px] py-[24px] bg-[white] party-item h-[100px]">
                        <img className="w-[42px] h-[42px]" src={acidIcon} alt="" />
                        <div className="ml-[12px]">
                            <div className="flex items-center">
                                <h1 className="my-0 text-[14px] font-[700] leading-[20px] mr-[5px]">EVMs</h1>
                                <svg onClick={(e) => {
                                    e.stopPropagation()
                                    window.open("https://twitter.com/Acidmarket2024")
                                }} className=" cursor-pointer" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_2212_12245)">
                                        <path d="M17.0994 6.59814H19.2713L14.5263 12.0214L20.1084 19.4012H15.7377L12.3143 14.9254L8.39727 19.4012H6.22403L11.2993 13.6004L5.94434 6.59814H10.4261L13.5204 10.6892L17.0994 6.59814ZM16.3371 18.1012H17.5406L9.77211 7.82986H8.48065L16.3371 18.1012Z" fill="#1E1E1E" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_2212_12245">
                                            <rect width="15.7576" height="15.7576" fill="white" transform="translate(5.12109 5.12097)" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <svg onClick={(e) => {
                                    e.stopPropagation();
                                    window.open("https://t.me/acidmarket")
                                }} className=" cursor-pointer" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M7.42933 7.42859C8.90537 5.95157 10.9108 5.12097 12.9999 5.12097C15.089 5.12097 17.0944 5.95157 18.5704 7.42859C20.0477 8.90562 20.8787 10.911 20.8787 12.9998C20.8787 15.0885 20.0477 17.0939 18.5704 18.5709C17.0944 20.048 15.089 20.8785 12.9999 20.8785C10.9108 20.8785 8.90537 20.048 7.42933 18.5709C5.95206 17.0939 5.12109 15.0885 5.12109 12.9998C5.12109 10.911 5.95206 8.90562 7.42933 7.42859ZM13.2908 11.0704C12.5315 11.3973 11.0128 12.074 8.73475 13.1002C8.36484 13.2524 8.17069 13.4012 8.1536 13.5467C8.12354 13.7924 8.42109 13.8893 8.82538 14.021C8.88084 14.0391 8.93831 14.0578 8.99721 14.0776C9.39642 14.2117 9.93355 14.3687 10.2119 14.3748C10.4658 14.3805 10.7478 14.2726 11.0591 14.0511C13.1883 12.5654 14.2858 11.8144 14.3554 11.7982C14.4042 11.7868 14.4714 11.7725 14.5166 11.8145C14.5629 11.8564 14.558 11.936 14.5532 11.9573C14.5244 12.0871 13.36 13.2067 12.7541 13.7894C12.5636 13.9725 12.4283 14.1026 12.4009 14.1322C12.3395 14.1981 12.277 14.2604 12.2169 14.3203C11.8464 14.6897 11.5685 14.9668 12.2324 15.4192C12.5543 15.6385 12.8112 15.8195 13.068 16.0004C13.344 16.1947 13.6197 16.389 13.9757 16.6305C14.0672 16.6926 14.1546 16.757 14.2398 16.8198C14.5634 17.0584 14.8541 17.2727 15.2136 17.2385C15.4224 17.2187 15.6385 17.0156 15.7472 16.4101C16.006 14.9789 16.5151 11.8781 16.6323 10.6004C16.6432 10.4885 16.6298 10.3452 16.62 10.2823C16.609 10.2194 16.587 10.1298 16.5089 10.0635C16.4149 9.98483 16.2709 9.96829 16.2062 9.96943C15.9119 9.97486 15.4615 10.137 13.2908 11.0704Z" fill="#1E1E1E" />
                                </svg>

                            </div>
                            <p className="my-0 mt-[4px] w-[210px] text-[#A9A9A9] text-[12px] font-[400] leading-[12px]">An Inscriptions Exchange based on multichain programable indexers.</p>
                        </div>
                        <svg className="ml-auto" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.97044 0.648278L11.8753 7.55312C11.999 7.67678 12.0664 7.83605 12.0664 8.00095C12.0664 8.16584 11.999 8.32511 11.8753 8.4469L5.0304 15.3517C4.90861 15.4735 4.72498 15.5429 4.52261 15.5429C4.34273 15.5429 4.20969 15.4867 4.07666 15.3517C3.82182 15.0969 3.82182 14.7128 4.07666 14.458L10.5355 8.00095L4.07666 1.54207C3.82182 1.28723 3.82182 0.90311 4.07666 0.648278C4.33149 0.393445 4.71561 0.393445 4.97044 0.648278Z" fill="#1E1E1E" />
                        </svg>
                    </div>
                </Col>
                <Col span={24} md={{span: 8}}>
                    <div onClick={() => window.open("https://evms.app")} className="w-full flex items-center px-[14px] py-[24px] bg-[white] party-item h-[100px]">
                        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M1.25684 22.0001C1.25684 10.5663 10.5659 1.2572 21.9997 1.2572C33.4335 1.2572 42.7425 10.5663 42.7425 22.0001C42.7425 33.4339 33.4335 42.7429 21.9997 42.7429C10.5659 42.7429 1.25684 33.4339 1.25684 22.0001ZM19.9768 22C19.9768 23.1156 20.8841 24.0229 21.9997 24.0229C23.1153 24.0229 24.0226 23.1156 24.0226 22C24.0226 20.8844 23.1153 19.9771 21.9997 19.9771C20.8841 19.9771 19.9768 20.8844 19.9768 22ZM32.1188 22.0047C32.1188 23.1203 31.2115 24.0276 30.0959 24.0276C28.9803 24.0276 28.073 23.1203 28.073 22.0047V22C28.073 20.8844 28.9803 19.9771 30.0959 19.9771C31.2115 19.9771 32.1188 20.8844 32.1188 22.0047ZM13.9035 24.0229C15.0237 24.0229 15.9264 23.1156 15.9264 22C15.9264 20.8844 15.0191 19.9771 13.9035 19.9771C12.7878 19.9771 11.8806 20.8844 11.8806 22C11.8806 23.1156 12.7878 24.0229 13.9035 24.0229Z" fill="black" />
                        </svg>
                        <div className="ml-[12px]">
                            <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                                <h1 className="my-0 text-[14px] font-[700] leading-[20px] mr-[5px]">More</h1>
                            </div>
                            <p className="my-0 mt-[4px] w-[210px] text-[#A9A9A9] text-[12px] font-[400] leading-[12px]">Coming Soon......</p>
                        </div>
                        <svg className="ml-auto" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.97044 0.648278L11.8753 7.55312C11.999 7.67678 12.0664 7.83605 12.0664 8.00095C12.0664 8.16584 11.999 8.32511 11.8753 8.4469L5.0304 15.3517C4.90861 15.4735 4.72498 15.5429 4.52261 15.5429C4.34273 15.5429 4.20969 15.4867 4.07666 15.3517C3.82182 15.0969 3.82182 14.7128 4.07666 14.458L10.5355 8.00095L4.07666 1.54207C3.82182 1.28723 3.82182 0.90311 4.07666 0.648278C4.33149 0.393445 4.71561 0.393445 4.97044 0.648278Z" fill="#1E1E1E" />
                        </svg>
                    </div>
                </Col>
            </Row>
        </div>
    </div>
}

export default Marketplace;