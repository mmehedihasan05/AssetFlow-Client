import { useNavigate, useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    const Navigate = useNavigate();

    return (
        <div
            id="error-page"
            className="flex flex-col justify-center items-center space-y-6 h-[100vh] text-[#125397]"
        >
            <div className="flex gap-4 items-end">
                <div className="h-14 w-14">
                    <img src="/warning.png" alt="" />
                </div>

                <h1 className="text-5xl text-center font-bold">Page Not Found</h1>
            </div>

            <p>
                <i>
                    <b>Error Data:</b> {error.data}
                </i>
                <br />
                <i>
                    <b>Error Code:</b> {error.status}
                </i>
                <br />
                <i>
                    <b>Error Message:</b> {error.statusText}
                </i>
            </p>

            <button onClick={() => Navigate("/")} className="btn custom-primary-btn ">
                Go Home
            </button>
        </div>
    );
}
