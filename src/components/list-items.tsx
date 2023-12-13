import type { ReactNode } from "react"

import type { TFollowed, TUserList } from "~types"





export function ListItem(item: TFollowed | TUserList | any) {
  const background = () => {
    if (item.status === "unfollowed") return "bg-red-700"
    else if (item.status === "followed") return "bg-green-700"
    else return "bg-teal-900"
  }
  const createdAt = item?.created_at
    ? new Date(item?.created_at).toISOString()
    : null

  return (
    <div className={"flex flex-nowrap items-center mb-1 " + background()}>
      <div>
        <img
          className="rounded-full w-14"
          src={item.user.profile_pic_url}
          alt="userimg"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col flex-grow ml-2">
        <p className="">{item.user.username}</p>
        {item?.status ? <p className="">{item?.status}</p> : null}
        {item?.created_at ? <p className="">{createdAt}</p> : null}
      </div>
      <div>{item?.children.button}</div>
    </div>
  )
}

export const StatusBar = ({ statusExecute, activeFollowList, count }) => {
  return (
    <div>
      {activeFollowList ? (
        <div>
          <p>
            status {statusExecute} : {count}
          </p>
        </div>
      ) : (
        <div>
          <p>
            {statusExecute} : {count}
          </p>
        </div>
      )}
    </div>
  )
}

export function ListButton(props: object, children: ReactNode) {
  return (
    <button type="button" className="ml-2 border-2 border-blue-500" {...props}>
      {children}
    </button>
  )
}