import { useEffect } from "react";

export const useOnClickOutside = (ref, handler, exceptionRef) => {
  useEffect(() => {
    const listener = (event) => {
      if (
        !ref.current ||
        ref.current.contains(event.target) ||
        exceptionRef?.current?.contains(event.target)
      ) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler, exceptionRef]);
};

export const useOutsideAlerter = (ref, cb) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        cb();
      }
    }

    // Bind the event listener
    document.addEventListener("click", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref, cb]);
};

export const filterObjectValue = (data) => {
  let afterFilter = {};
  for (const [key, value] of Object.entries(data)) {
    for (const [k, v] of Object.entries(value)) {
      if (v) {
        afterFilter = {
          ...afterFilter,
          [key]: { ...afterFilter[key], [k]: v },
        };
      }
    }
  }
  return afterFilter;
};