import SectionTitle from "../../Components/SectionTitle";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useContext, useEffect, useState } from "react";
import { Tooltip } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import moment from "moment";
import DataLoading from "../../Components/DataLoading";

function daysToBirthday(birthday) {}
daysToBirthday("2023-11-25");

const MyTeam = () => {
    let { currentUserInfo } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    // adding birthday status
    const [modifiedTeamMembers, setModifiedTeamMembers] = useState([]);

    // Team Members
    const {
        data: myTeam = [],
        isLoading: isLoading_myTeam,
        refetch: refetch_myTeam,
    } = useQuery({
        queryKey: ["myTeam", currentUserInfo?.userEmail],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/myteam?email=${currentUserInfo?.userEmail}`);
            return res.data;
        },
    });

    useEffect(() => {
        console.log(myTeam);
        const currentDate = new Date().toISOString().split("T")[0];
        const currentDate_Month = currentDate.split("-")[1];
        const currentDate_day = currentDate.split("-")[2];

        let tempTeamMembers = myTeam.filter((member) => {
            if (member?.userDob) {
                let dob_Month = member.userDob.split("-")[1];

                // this user birthday will be this month
                if (dob_Month == currentDate_Month) {
                    let dob_day = member.userDob.split("-")[2];
                    let difference = currentDate_day - dob_day;

                    if (difference === 0) {
                        member.dobStatus = "Today is birthday!";
                    } else if (difference > 0) {
                        member.dobStatus = "Birthday passed!";
                    } else if (difference < 0) {
                        member.dobStatus = `${Math.abs(difference)} days left for Birthday!`;
                    }

                    return member;
                }
            }
        });

        setModifiedTeamMembers(tempTeamMembers);
    }, [myTeam]);

    console.log(myTeam);

    return (
        <div className="custom-width   md:max-w-full lg:max-w-[75%] mx-auto px-6 space-y-12">
            <div className="bg-white shadow-md rounded-md px-3 py-6 space-y-6">
                {/* Heading */}
                <div className="text-center px-4">
                    <h1 className="text-primary sectionHeading text-2xl font-semibold text-[--text-secondary]">
                        Upcoming Events
                    </h1>
                    <div className="text-sm text-[--text-secondary]">
                        Team Members who has birthday in this month
                    </div>
                </div>

                {/* Contents */}
                <div className="space-y-6">
                    {isLoading_myTeam && <DataLoading></DataLoading>}
                    {modifiedTeamMembers.map((user, idx) => (
                        <div
                            key={idx}
                            className="flex gap-4 items-center
                                 border-b px-2 py-4 bg-white shadow-sm rounded-lg hover:bg-blue-50"
                        >
                            <div className=" flex justify-center w-[15%]">
                                <img
                                    src={user?.userImage}
                                    className="h-12 w-12 rounded-full object-cover outline outline-1  outline-offset-1 p-2px"
                                />
                            </div>
                            <div className="flex-1 w-[40%]">{user?.userFullName}</div>
                            <div className=" flex justify-center w-[15%] text-center">
                                {user?.userDob
                                    ? moment(user?.userDob).format("DD MMM YYYY")
                                    : "---"}
                            </div>
                            <div className="w-[30%] text-center font-medium">{user?.dobStatus}</div>
                        </div>
                    ))}
                    {modifiedTeamMembers.length === 0 && !isLoading_myTeam && (
                        <div className="mt-8 text-center text-xl text-[--warning] font-medium">
                            No upcoming birthday in this month!
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-white shadow-md rounded-md px-3 py-6 space-y-6">
                {/* Heading */}

                <div className="text-center px-4">
                    <h1 className="text-primary sectionHeading text-2xl font-semibold text-[--text-secondary]">
                        Team Members
                    </h1>
                    <div className="text-sm text-[--text-secondary]">Team Members of your team</div>
                </div>

                {/* Contents */}
                <div className="space-y-6">
                    {isLoading_myTeam && <DataLoading></DataLoading>}
                    {myTeam.map((user, idx) => (
                        <div
                            key={idx}
                            className="flex gap-4 items-center
                                 border-b px-2 py-4 bg-white shadow-sm rounded-lg hover:bg-blue-50"
                        >
                            <div className=" flex justify-center w-[25%]">
                                <img
                                    src={user?.userImage}
                                    className="h-12 w-12 rounded-full object-cover outline outline-1  outline-offset-1 p-2px"
                                />
                            </div>
                            <div className="w-[40%]">{user?.userFullName}</div>
                            <div className="w-[25%] text-center">
                                {user?.userRole === "employee" ? (
                                    <Tooltip title="Employee" arrow>
                                        <PersonOutlineIcon />
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="HR" arrow>
                                        <AdminPanelSettingsIcon />
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                    ))}
                    {myTeam.length === 0 && !isLoading_myTeam && (
                        <div className="mt-8 text-center text-xl text-[--warning] font-medium">
                            No upcoming birthday in this month!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyTeam;
