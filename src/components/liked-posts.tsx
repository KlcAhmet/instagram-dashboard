import { useMemo, useState } from "react"

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

/*
unlike

https://www.instagram.com/reel/CxNzNjfMCRn/

fb_dtsg:
 "DTSGInitData": {
    "token": "NAcP0ZNPw_k41imNPmIja2WIFjl_m8xWC5kUPi7BEYkSvqLl_xVW3hw:17853599968089360:1700826290",
    "async_get_token": "AQx7DLraU5orsHUSSb3zC2ECp8J7UcJ5nHXruMHgsZvOD9GG:17853599968089360:1700826290"
},

variables: "page_id": "postPage_3192432942705026151",

doc_id:  <script src="https://static.cdninstagram.com/rsrc.php/v3iCYI4/y8/l/makehaste_jhash/_SaD8dG4YG43s1xTRi65WVSXMX--ykgWcd6G11ErteRPKx7l7itV0BXappxhWHMZSX.js?_nc_x=Ij3Wp8lg5Kz" data-bootloader-hash="MLJzGmE" async="1" crossorigin="anonymous" data-tsrc="https://static.cdninstagram.com/rsrc-translations.php/v6icfU4/yF/l/tr_TR/_SaD8dG4YG43s1xTRi65WVSXMX--ykgWcd6G11ErteRPKx7l7itV0BXappxhWHMZSX.js?_nc_x=Ij3Wp8lg5Kz" data-p=":38,15,21,161,115,16" data-btmanifest="1010545497_main" data-c="1" nonce="7KPyCtin"></script>
*/