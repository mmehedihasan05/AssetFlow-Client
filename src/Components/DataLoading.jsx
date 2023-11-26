import { Circles } from "react-loader-spinner";

const DataLoading = () => {
    return (
        <div className="flex justify-center mt-8">
            <Circles
                height="80"
                width="80"
                color="#1976d2"
                ariaLabel="circles-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
        </div>
    );
};

export default DataLoading;
