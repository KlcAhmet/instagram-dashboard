import { useMemo, useState } from "react"

import { postUnlike } from "~api/movements/unlike"
import { ListButton, StatusBar } from "~components/list-items"
import { updateUserIndexedDB } from "~indexedDB"
import { useAppDispatch, useAppSelector } from "~store"
import { setLikesMediaLikes, type TUserState } from "~store/userSlice"

import ListIcon from "../appassets/followers.png"

export function LikedPosts() {
  const dispatch = useAppDispatch()
  const user: TUserState = useAppSelector((state) => state.user)
  const likesMediaLikes = useMemo(() => {
    return user.likes.liked_posts.likes_media_likes
  }, [user.likes.liked_posts.likes_media_likes])
  const [activeFollowList, setActiveFollowList] = useState(false)

  const handleFileChange = (event) => {
    const file = event.target.files[0]

    if (file) {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const content = JSON.parse(`${e.target.result}`)
          console.log(content.likes_media_likes)
          dispatch(setLikesMediaLikes(content.likes_media_likes))
          updateUserIndexedDB({
            ...user,
            likes: {
              liked_posts: {
                likes_media_likes: content.likes_media_likes
              }
            }
          })
        } catch (error) {
          console.error("JSON parsing error:", error)
        }
      }

      reader.readAsText(file)
    }
  }

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
                    updateUserIndexedDB({
                      ...user,
                      likes: {
                        liked_posts: {
                          likes_media_likes: []
                        }
                      }
                    })
                  }
                },
                "Listeyi Temizle"
              )}
              <div className="max-h-[500px] overflow-y-scroll">
                {
                  <div>
                    <h2>JSON Dosyasını Listeleyen Component</h2>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".json"
                    />
                    {likesMediaLikes && (
                      <div>
                        <h3>JSON İçeriği:</h3>
                        {likesMediaLikes.map((item) => {
                          const ts = new Date(
                            item.string_list_data[0].timestamp * 1000
                          ).toLocaleString()
                          return (
                            <div key={item.string_list_data[0].href}>
                              <p>{item.title}</p>
                              <p>{item.string_list_data[0].href}</p>
                              <p>{ts}</p>
                              <div>
                                {ListButton(
                                  {
                                    onClick: () => {
                                      postUnlike(item.string_list_data[0].href)
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
