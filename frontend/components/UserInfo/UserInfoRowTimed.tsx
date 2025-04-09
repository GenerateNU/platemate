import React from "react";
import { ThemedText } from "../themed/ThemedText";
import UserInfoRowBase from "./UserInfoRowBase";

type Props = {
    name: string;
    username: string;
    time: number;
    icon: string;
    id?: string;
};

const UserInfoRowTimed = ({ name, username, time, icon }: Props) => {
    return (
        <UserInfoRowBase
            name={name}
            username={username}
            right={<ThemedText type="caption">{time} ago</ThemedText>}
            icon={icon}
        />
    );
};

export default UserInfoRowTimed;
