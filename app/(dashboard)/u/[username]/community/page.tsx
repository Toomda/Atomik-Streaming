import { getBannedUsers } from "@/actions/ban";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { format } from "date-fns";

const CommunityPage = async () => {
  const bannedUsers = await getBannedUsers();

  const formattedData = bannedUsers.map((user: any) => ({
    ...user,
    userId: user.id,
    imageUrl: user.image,
    username: user.username,
    createdAt: format(new Date(user.createdAt), "dd/MM/yyyy"),
  }));

  return (
    <div className="p-6 ">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Community Settings</h1>
      </div>
      <DataTable columns={columns} data={formattedData} />
    </div>
  );
};

export default CommunityPage;
