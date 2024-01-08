import React from "react";

export const MembersModal = ({ members }) => {
  return (
    <div className="fixed top-1/3 left-1/2 w-3/4 md:w-96 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-8 rounded-md shadow-md">
      <>
        <div className="flex justify-between items-baseline">
          <h2 className="text-2xl font-bold mb-4 overflow-auto">Jäsenet</h2>
        </div>
        <ul>
          {members.map((member, index) => (
            <li
              className={index % 2 === 0 ? "bg-slate-300 w-fit" : "w-fit"}
              key={member.email}
            >
              {member.nickname}
            </li>
          ))}
        </ul>
      </>
    </div>
  );
};
