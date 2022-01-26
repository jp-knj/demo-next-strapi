import React from "react";
import { useAppContext } from "../Context";

const Main = () => {
    const { name, setName } = useAppContext();
    return (
        <>
        <h1>
            {name}
        </h1>
                <input
                    placeholder={"Enter your name"}
                    onChange={e => setName(e.currentTarget.value)}
                    style={{ background: "#8080802e" }}
                />
        </>
    );
};

export default Main;