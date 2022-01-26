import React, { useContext, useState } from "react";

export interface Context {
    name: string;
    setName: (v: string) => void;
}
const defaultVal:Context = {
    name: "sample",
    setName: () => {},
};

const context = React.createContext(defaultVal);

const { Provider } = context;

export const ContextWrapper = ({ children }: { children: React.ReactNode}) => {
    const [name, setName] = useState(defaultVal.name);
    return <Provider value={{ name, setName }}>{children}</Provider>;
};

export const useAppContext = () => useContext(context);