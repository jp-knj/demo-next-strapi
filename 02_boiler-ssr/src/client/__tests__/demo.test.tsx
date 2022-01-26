import React from "react"
import { describe, expect, it} from 'vitest'
import { render } from "@testing-library/react"
import { renderHook, act } from "@testing-library/react-hooks";

import Main from "../pages/Main"
import useCounter from "../demoHook";

describe("demo", () => {
    it("should be testable", () => {
        expect(1 + 1).toBe(2);
    });
    it("should be able to test component", () => {
        const { getByText } = render(<Main />);
        expect(getByText("sample"))
    });
    // @see https://react-hooks-testing-library.com/
    it("should be able to test hook", () => {
        const { result } = renderHook(() => useCounter());
        act(() => {
            result.current.increment();
        });
        expect(result.current.count).toBe(1);
    });
});