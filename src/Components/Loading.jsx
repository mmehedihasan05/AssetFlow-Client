import { RotatingLines } from "react-loader-spinner";

const Loading = () => {
    return (
        <div className=" flex items-center justify-center h-[100vh]">
            <RotatingLines
                strokeColor="#4b4870"
                strokeWidth="4"
                animationDuration="0.80"
                width="200"
                visible={true}
            />
        </div>
    );
};

export default Loading;
