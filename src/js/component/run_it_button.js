import React from "react";

export default function RunItButton() {

    function runIt() {
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            browser.runtime.sendMessage({
                tabId: tabs[0].id,
                type: 'runTheJob'
            });
        });
    }

    return (
        <button
            onClick={runIt}
        >Run It</button>
    )
}