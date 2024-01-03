import { useEffect, useMemo, useState } from "react"

import { postUnlike } from "~api/movements/unlike"
import { ListButton, StatusBar } from "~components/list-items"
import { updateUserIndexedDB } from "~indexedDB"
import { useAppDispatch, useAppSelector } from "~store"
import {
  setLikesMediaLikes,
  setLikesMediaLikesFilter,
  setLikesMediaLikesStatusExecute,
  type TUserState
} from "~store/userSlice"

import ListIcon from "../appassets/followers.png"

export function LikedPosts() {
  const dispatch = useAppDispatch()
  const user: TUserState = useAppSelector((state) => state.user)
  const likesMediaLikes = useMemo(() => {
    return user.likes.liked_posts.likes_media_likes
  }, [user.likes.liked_posts.likes_media_likes])
  const followers = useMemo(() => {
    return user.followers.users
  }, [user.followers.users])
  const following = useMemo(() => {
    return user.following.users
  }, [user.following.users])
  const statusExecute = useMemo(() => {
    return user.likes.liked_posts.status_execute
  }, [user.likes.liked_posts.status_execute])
  const filterFollowers = useMemo(() => {
    return user.likes.liked_posts.filter.followers
  }, [user.likes.liked_posts.filter.followers])
  const filterFollowing = useMemo(() => {
    return user.likes.liked_posts.filter.following
  }, [user.likes.liked_posts.filter.following])
  const [activeFollowList, setActiveFollowList] = useState(false)
  const [filteredLikesMediaLikes, setFilteredLikesMediaLikes] = useState([])

  function setfilteredLikesMediaLikesList() {
    if (!filterFollowers && !filterFollowing) {
      setFilteredLikesMediaLikes([])
    } else if (filterFollowers && !filterFollowing) {
      setFilteredLikesMediaLikes(
        likesMediaLikes.filter(
          (item) => !followers.find((item2) => item2.username === item.title)
        )
      )
    } else if (!filterFollowers && filterFollowing) {
      setFilteredLikesMediaLikes(
        likesMediaLikes.filter(
          (item) => !following.find((item2) => item2.username === item.title)
        )
      )
    } else if (filterFollowers && filterFollowing) {
      setFilteredLikesMediaLikes(
        likesMediaLikes.filter(
          (item) =>
            !following.find((item2) => item2.username === item.title) &&
            !followers.find((item2) => item2.username === item.title)
        )
      )
    }
  }

  function saveDB(key: string, value: any) {
    updateUserIndexedDB({
      ...user,
      likes: {
        liked_posts: {
          ...user.likes.liked_posts,
          [key]: value
        }
      }
    })
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]

    if (file) {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const content = JSON.parse(`${e.target.result}`)
          console.log(content.likes_media_likes)
          dispatch(setLikesMediaLikes(content.likes_media_likes))
          saveDB("likes_media_likes", content.likes_media_likes)
        } catch (error) {
          console.error("JSON parsing error:", error)
        }
      }

      reader.readAsText(file)
    }
  }

  function automaticUnlike() {
    if (statusExecute === "running") {
      if (filteredLikesMediaLikes.length) {
        console.log("unlike start: ", filteredLikesMediaLikes[0])
        postUnlike(filteredLikesMediaLikes[0].string_list_data[0].href).then(
          (result: boolean) => {
            console.log("unliked: ", filteredLikesMediaLikes[0])
            const filteredList = likesMediaLikes.filter((item2) => {
              if (
                item2.string_list_data[0].href ===
                filteredLikesMediaLikes[0].string_list_data[0].href
              )
                return null
              return item2
            })
            setFilteredLikesMediaLikes(filteredLikesMediaLikes.shift())
            dispatch(setLikesMediaLikes(filteredList))
            saveDB("likes_media_likes", filteredList)
          }
        )
      }
    } else {
      dispatch(
        setLikesMediaLikesFilter({
          followers: false,
          following: false
        })
      )
      saveDB("filter", {
        followers: false,
        following: false
      })
      dispatch(setLikesMediaLikesStatusExecute("finished"))
      saveDB("status_execute", "finished")
    }
  }

  useEffect(() => {
    setfilteredLikesMediaLikesList()
    setTimeout(() => {
      if (statusExecute === "running") {
        console.log("automaticUnlike starting")
        automaticUnlike()
      }
    }, 35000)
  }, [statusExecute, likesMediaLikes])

  return (
    <div className="border-2 border-amber-600 inline-block">
      <div>
        <button
          onClick={() => setActiveFollowList(!activeFollowList)}
          className={activeFollowList ? "flex flex-row" : "flex flex-col"}>
          <div>
            <img
              src={`${ListIcon}`}
              className="w-10 h-10 mx-auto"
              alt="followers"
            />
            <span>Unlike</span>
          </div>
          <StatusBar
            activeFollowList={activeFollowList}
            statusExecute={"nope"}
            count={likesMediaLikes.length}
          />
        </button>
      </div>
      {activeFollowList ? (
        <div>
          <div className="flex flex-nowrap">
            <div className="w-72">
              {ListButton(
                {
                  onClick: () => {
                    dispatch(setLikesMediaLikes([]))
                    saveDB("likes_media_likes", [])
                  }
                },
                "Listeyi Temizle"
              )}
              {ListButton(
                {
                  onClick: () => {
                    dispatch(
                      setLikesMediaLikesFilter({
                        followers: !filterFollowers,
                        following: filterFollowing
                      })
                    )
                    saveDB("filter", {
                      followers: !filterFollowers,
                      following: filterFollowing
                    })
                  },
                  className: filterFollowers
                    ? "ml-2 border-2 border-green-500"
                    : "ml-2 border-2 border-blue-500"
                },
                "Takipçiler"
              )}
              {ListButton(
                {
                  onClick: () => {
                    dispatch(
                      setLikesMediaLikesFilter({
                        followers: filterFollowers,
                        following: !filterFollowing
                      })
                    )
                    saveDB("filter", {
                      followers: filterFollowers,
                      following: !filterFollowing
                    })
                  },
                  className: filterFollowing
                    ? "ml-2 border-2 border-green-500"
                    : "ml-2 border-2 border-blue-500"
                },
                "Takip edilen"
              )}
              {ListButton(
                {
                  onClick: () => {
                    if (statusExecute === "running") {
                      dispatch(setLikesMediaLikesStatusExecute("idle"))
                      saveDB("status_execute", "idle")
                    } else {
                      dispatch(setLikesMediaLikesStatusExecute("running"))
                      saveDB("status_execute", "running")
                    }
                  },
                  className:
                    statusExecute === "running"
                      ? "ml-2 border-2 border-green-500"
                      : "ml-2 border-2 border-blue-500"
                },
                "Otomatik Unlike"
              )}
              <div className="max-h-[500px] overflow-y-scroll">
                {
                  <div>
                    <h2></h2>
                    <h2>---JSON Dosyasını Listeleyen Component--</h2>
                    <h2></h2>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".json"
                    />
                    {likesMediaLikes && (
                      <div>
                        <h3>JSON İçeriği:</h3>
                        {filteredLikesMediaLikes && (
                          <p>
                            Filtrelenmiş Liste: {filteredLikesMediaLikes.length}
                          </p>
                        )}
                        {(filteredLikesMediaLikes.length
                          ? filteredLikesMediaLikes
                          : likesMediaLikes
                        ).map((item) => {
                          const ts = new Date(
                            item.string_list_data[0].timestamp * 1000
                          ).toLocaleString()
                          return (
                            <div key={item.string_list_data[0].href}>
                              <p>{item.title}</p>
                              <a
                                href={item.string_list_data[0].href}
                                target="_blank">
                                {item.string_list_data[0].href}
                              </a>
                              <p>{ts}</p>
                              <div>
                                {ListButton(
                                  {
                                    onClick: () => {
                                      postUnlike(
                                        item.string_list_data[0].href
                                      ).then((result: boolean) => {
                                        const filteredList =
                                          likesMediaLikes.filter((item2) => {
                                            if (
                                              item2.string_list_data[0].href ===
                                              item.string_list_data[0].href
                                            )
                                              return null
                                            return item2
                                          })
                                        dispatch(
                                          setLikesMediaLikes(filteredList)
                                        )
                                        saveDB(
                                          "likes_media_likes",
                                          filteredList
                                        )
                                      })
                                    }
                                  },
                                  "X"
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
