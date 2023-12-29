
import { App as Antd } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard'

const Copy: React.FC<{
    text: string;
    children: React.ReactNode | string;
    className?: string;
}> = ({ text, children, className }) => {

    const { message } = Antd.useApp()

    return <div className={className}>
        <CopyToClipboard text={text}>
            <div onClick={() => message.success("Copy Success")}>{children}</div>
        </CopyToClipboard>
    </div>
}

export default Copy;