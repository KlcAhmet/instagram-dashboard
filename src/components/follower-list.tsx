import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "src/store"

import { getFollowList } from "~api"
import { Button, ButtonText } from "~components/cbutton"
import { ListItem } from "~components/list-items"
import { ListItemMap } from "~helpers"
import { updateUserIndexedDB } from "~indexedDB"
import { setFollowers } from "~store/userSlice"
import type { TFollowersList } from "~types"





export function FollowerList() {
  const dispatch = useAppDispatch()
  const {
    status_execute,
    next_max_id,
    users,
    last_users_log,
    follow_logs
  }: TFollowersList = useAppSelector((state) => state.user.followers)

  /* const maxId = useMemo(
     () => user.followers.next_max_id,
     [user.followers.next_max_id]
   )*/

  /* const lastUserLog = useMemo(() => {
     return user.followers.last_user_log
   }, [user.followers.last_user_log])*/

  const getFollowerList = useCallback(async () => {
    const data = await getFollowList({ next_max_id, type: "followers" })
    if (typeof data === "number") {
      /*
       * add 404 429 status code
       */
      dispatch(
        setFollowers({
          status_execute: "finished"
        })
      )
    } else {
      dispatch(
        setFollowers({
          status_execute: "running",
          ...data,
          users: [...users, ...data["users"]]
        })
      )
    }
  }, [next_max_id])

  /*  function init() {
      setTimeout(() => {
        getFollowList({ maxId, type: "followers" }).then((data) => {
          if (typeof data === "number") {
            /!*
             * add 404 429 status code
             *!/
            dispatch(
              setFollowers({
                status_execute: "finished"
              })
            )
          } else {
            dispatch(
              setFollowers({
                status_execute: "running",
                ...data,
                users: [...user.followers.users, ...data["users"]]
              })
            )
          }
        })
      }, 5000)
    }*/

  const debounce = (callback: any, time: number = 5000) => {
    let timer: any
    console.log("debounce")
    return () => {
      clearTimeout(timer)
      timer = setTimeout(callback, time)
    }
  }

  /*
    useEffect(() => {
  if (next_max_id && status_execute === "running") {
        getFollowerList()
      } else if (!next_max_id && status_execute === "running") {
        const followers = {
          status_execute: "finished",
          last_user_log: users,
          followed: [...findFollowedUsers(last_user_log, users), ...followed],
          unfollowed: lastUserLog.users
            ? findUnFollowedUsers(lastUserLog, users, unFollowed)
            : []
        }
        dispatch(
          setUser({
            "edge_followed_by.count": users.length
          })
        )
        dispatch(setFollowers(followers))
        updateUserIndexedDB({
          ...user,
          followers: {
            ...user.followers,
            ...followers
          }
        })
      }
    }, [status_execute, next_max_id])*/

  function refreshFollowes() {
    dispatch(
      setFollowers({
        status_execute: "idle",
        users: []
      })
    )
  }

  function clearLogList() {
    updateUserIndexedDB({
      ...users,
      followers: {
        /*...user.followers,*/
        unfollowed: [],
        followed: []
      }
    }).then(() => {
      dispatch(
        setFollowers({
          unfollowed: [],
          followed: []
        })
      )
    })
  }

  return (
    <div className="bg-light">
      {/*  <StatusBar statusExecute={statusExecute} count={users.length} />*/}
      <div className="flex flex-row">
        <div className="basis-1/2">
          <Button className="px-1.5" onClick={() => refreshFollowes()}>
            <ButtonText text="Yenile" />
          </Button>
          <div className="max-h-[700px] overflow-y-auto space-y-1">
            {ListItemMap(users).map((item) => (
              <ListItem {...item} key={`${item.user.pk}-follower`} />
            ))}
            {/* {statusExecute === "running" && (
              <div className="m-2">
                <Loading imgClass="h-10" animation />
              </div>
            )}*/}
          </div>
        </div>
        {/* <div className="basis-1/2">
          <Button className="px-1.5" onClick={() => clearLogList()}>
            <ButtonText text="Tümünü Sil" />
          </Button>
          <div className="max-h-[700px] overflow-y-auto space-y-1">
            {ListItemMap(
              [...unFollowed, ...followed].sort((a, b) => {
                return (
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
                )
              })
            ).map((item, index) => (
              <ListItem {...item} key={`${item.user.pk}-follower-${index}`} />
            ))}
          </div>
        </div>*/}
      </div>
    </div>
  )
}
