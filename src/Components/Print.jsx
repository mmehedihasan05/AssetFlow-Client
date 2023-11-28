import { Button } from "@mui/material";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const Print = () => {
    const [printStage, setPrintStage] = useState(false);
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <div>
            {/* <ComponentToPrint ref={componentRef} /> */}
            <div
                className={printStage ? " h-11 bg-slate-500" : "h-11 bg-slate-500 "}
                ref={componentRef}
            >
                <div>Xyz</div>
                <div>Xyz</div>
                <div>Xyz</div>
            </div>
            <Button
                variant="contained"
                onClick={() => {
                    setPrintStage(true);
                    handlePrint();
                }}
            >
                Print Details
            </Button>
        </div>
    );
};

export default Print;
