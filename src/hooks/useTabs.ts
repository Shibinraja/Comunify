import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

function usePrevious<T>(value: T) {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

export function useTabs<K extends string>(tabs: K[], defaultTab?: K | null) {
  const state = useState<K | null>();
  const [selectedTab, setSelectedTab] = state;

  const activeIndex = useMemo(() => {
    if (selectedTab) {
      return tabs.indexOf(selectedTab);
    }

    // if no tabs are selected or found in the tabs array activeIndex return -1 to state the index.
    return -1;
  }, [selectedTab, tabs]);

  const previousActiveIndex = usePrevious(activeIndex);

    useEffect(() => {
    if (tabs.length === 0) {
      setSelectedTab(undefined);

      return;
    }
    // To check tabs array includes selectedTab from the tabs array. 
    if (selectedTab === null || (selectedTab && tabs.includes(selectedTab))) {
      return;
    }

    // If more thean two tabs, it check the previous tab selection and states the current index with the previous tab index number
    if (
      typeof previousActiveIndex === "number" &&
      previousActiveIndex >= 0 &&
      (tabs[previousActiveIndex] || tabs[previousActiveIndex - 1])
    ) {
      setSelectedTab(
        tabs[previousActiveIndex] || tabs[previousActiveIndex - 1]
      );

      return;
    }

    // if defaultTab option is not given at initial render it sets the first tab as the default option in the active tab list.

    if (defaultTab === null) {
      return;
    }

    setSelectedTab(
      defaultTab && tabs.includes(defaultTab) ? defaultTab : tabs[0]
    );
  }, [defaultTab, previousActiveIndex, selectedTab, setSelectedTab, tabs]);

  return state;
}
