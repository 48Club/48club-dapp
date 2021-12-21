import React from "react";

const map = {
    doing: {
      style: {
        backgroundColor: "#08C849",
        color: '#FFFFFF'
      },
      text: "质押中",
    },
    undo: {
      style: {
        backgroundColor: "#E9E9E9",
        color: '#54606C'
      },
      text: "未质押",
    },
    revert: {
      style: {
        backgroundColor: "#1DA9F8",
        color: '#FFFFFF'
      },
      text: "解除质押中",
    },
  };

export default function Tag(props) {
  const { type } = props;

  const data = map[type];
  return <span className="rounded h-7 px-3 py-1 w-fit" style={{...data.style, 'width': 'fit-content'}}>{data.text}</span>;
}
