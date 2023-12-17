// "use client";

// import { Button } from "@/components/ui/button";
// import { onFollow, onUnfollow } from "@/actions/follow";
// import { useTransition } from "react";
// import { toast } from "sonner";
// import { onBlock, onUnblock } from "@/actions/block";

// interface ActionsProps {
//   isFollowing: boolean;
//   userId: string;
// }

// export const Actions = ({ isFollowing, userId }: ActionsProps) => {
//   const [isPending, startTransition] = useTransition();

//   const handleFollow = () => {
//     startTransition(() => {
//       onFollow(userId)
//         .then((data) => toast.success(`Followed ${data.following.username}`))
//         .catch(() => toast.error("Something went wrong! Try again"));
//     });
//   };

//   const handleUnfollow = () => {
//     startTransition(() => {
//       onUnfollow(userId)
//         .then((data) => toast.success(`Unfollowed ${data.following.username}`))
//         .catch(() => toast.error("Something went wrong! Try again"));
//     });
//   };

//   const onClick = () => {
//     if (isFollowing) {
//       handleUnfollow();
//     } else {
//       handleFollow();
//     }
//   };

//   const handleBlock = () => {
//     startTransition(() => {
//       onBlock(userId)
//         .then((data) =>
//           toast.success(`Successfully blocked ${data.blocked.username}`)
//         )
//         .catch(() => toast.error("Something went wrong! Try again"));
//     });
//   };

//   return (
//     <>
//       <Button onClick={onClick} disabled={isPending} variant="primary">
//         {isFollowing ? "Unfollow" : "Follow"}
//       </Button>
//       <Button onClick={handleBlock} disabled={isPending}>
//         Block
//       </Button>
//     </>
//   );
// };
