// pass a values object and url link e.g values.email or values.isPublic
// method - string 'put' or 'post'
export async function putOrPostToApi(values, url, method) {
   try {
      const fields = Object.keys(values)
      const formData = new FormData()
      fields.forEach((field) => {
         formData.append(field, values[field])
      })
      const params = new URLSearchParams(formData.entries())
      const response = await fetch(`/api/${url}`, {
         method: method.toUpperCase(),
         body: params
      })
      if (response.status === 500) throw Error("Server Unavailable")
      const apiResponse = await response.json()
      if (!apiResponse.success) {
         if (apiResponse.err === "no-user") return window.location.reload()
         throw Error(apiResponse.err)
      }
      return apiResponse.result
   } catch (err) {
      if (err.message === "Failed to fetch") throw Error("You're offline")
      throw Error(err)
   }
}
// method - string 'get' or 'delete'
export async function fetchOrDeleteFromApi(link, method) {
   try {
      const response = await fetch(`/api/${link}`, {
         method: method.toUpperCase()
      })
      if (response.status === 500) throw Error("Server Unavailable")
      const apiResponse = await response.json()
      if (!apiResponse.success) {
         if (apiResponse.err === "no-user") return window.location.reload()
         throw Error(apiResponse.err)
      }
      return apiResponse.result
   } catch (err) {
      if (err.message === "Failed to fetch") throw Error("You're offline")
      throw Error(err)
   }
}
// check for user with cookie and perform several passed functions
export async function checkForUser(
   setUser,
   setUserCheckDone,
   setUserPreferences
) {
   return fetch("/api/getuserdetails")
      .then((response) => {
         if (response.status === 500) throw new Error("Server Unavailable")
         return response.json()
      })
      .then((apiResponse) => {
         if (apiResponse.success) {
            setUser(apiResponse.result.username)
            const {
               listSortPreference,
               mediaSortPreference,
               defaultMediaPage
            } = apiResponse.result
            setUserPreferences({
               listSortPreference,
               mediaSortPreference,
               defaultMediaPage
            })
         }
      })
      .catch((err) => console.log(err))
      .finally(() => setUserCheckDone(true))
}
// categories to iterate over
export function getCategories() {
   const categories = [
      { name: "towatch", text: "Movies" },
      { name: "towatchtv", text: "TV Shows" }
      // {name: 'ranked', text: 'Ranked'},
      // {name: 'other', text: 'Other'},
   ]
   // categories.ranked = 'Ranked';
   categories.towatch = "Movies"
   categories.towatchtv = "Tv Shows"
   // categories.other = 'Other';
   return categories
}
// Sort Lists and User Media Instants within them
export function sortLists(allLists, listPref, mediaPref) {
   /*
        alpha+ : alpha ascending. a-z
        alpha-
        created+ : created date ascending. old to new
        created-
        added+ : added date ascending. old to new
        added-
        imdb+ : rating ascending. lowest to highest
        imdb-
        release+ : release date ascending. oldest to newest
        release-
    */
   const lists = [...allLists]
   if (typeof lists === "undefined" || lists.length === 0) return []
   // const unTouchedLists = [...allLists];
   const listLength = lists.length
   if (listLength === 0) return lists
   for (let i = 0; i < listLength; i++) {
      let mediaInstants = lists[i].mediaInstants
      let sortedMediaInstants
      if (typeof mediaInstants === "undefined" || mediaInstants.length === 0) {
         continue
      }
      switch (mediaPref) {
         case "alpha+":
            sortedMediaInstants = mediaAlphaAsc(mediaInstants)
            break
         case "alpha-":
            sortedMediaInstants = mediaAlphaDes(mediaInstants)
            break
         case "added+":
            sortedMediaInstants = mediaAddedAsc(mediaInstants)
            break
         case "added-":
            sortedMediaInstants = mediaAddedDes(mediaInstants)
            break
         case "imdb+":
            sortedMediaInstants = mediaImdbAsc(mediaInstants)
            break
         case "imdb-":
            sortedMediaInstants = mediaImdbDes(mediaInstants)
            break
         case "release+":
            sortedMediaInstants = mediaReleaseAsc(mediaInstants)
            break
         case "release-":
            sortedMediaInstants = mediaReleaseDes(mediaInstants)
            break
         default:
            sortedMediaInstants = mediaInstants
      }
      lists[i].mediaInstants = sortedMediaInstants
   }
   let sortedLists
   switch (listPref) {
      case "alpha+":
         sortedLists = listAlphaAsc(lists)
         break
      case "alpha-":
         sortedLists = listAlphaDes(lists)
         break
      case "created+":
         sortedLists = listCreatedAsc(lists)
         break
      case "created-":
         sortedLists = listCreatedDes(lists)
         break
      default:
         sortedLists = lists
   }
   // console.log(sortedLists);
   return sortedLists

   function compareValues(arr, property) {
      return arr.sort((a, b) => {
         let nameA = a[property]
         let nameB = b[property]
         if (typeof nameA === "string") nameA = nameA.toUpperCase()
         if (typeof nameB === "string") nameB = nameB.toUpperCase()
         // check if both have createdAt properties before comparing
         if ((!nameA && nameB) || nameA < nameB) {
            return -1
         }
         if ((nameA && !nameB) || nameA > nameB) {
            return 1
         }
         return 0
      })
   }

   function compareMediaValues(arr, property) {
      return arr.sort((a, b) => {
         const mediaA = a.userMedia.media[property]
         const mediaB = b.userMedia.media[property]
         // check if both have createdAt properties before comparing
         if ((!mediaA && mediaB) || mediaA < mediaB) {
            return -1
         }
         if ((mediaA && !mediaB) || mediaA > mediaB) {
            return 1
         }
         return 0
      })
   }

   function listAlphaAsc(arr) {
      return compareValues(arr, "name")
   }

   function listAlphaDes(arr) {
      return listAlphaAsc(arr).reverse()
   }

   function listCreatedAsc(arr) {
      return compareValues(arr, "createdAt")
   }

   function listCreatedDes(arr) {
      return listCreatedAsc(arr).reverse()
   }

   function mediaAlphaAsc(arr) {
      return compareMediaValues(arr, "title")
   }

   function mediaAlphaDes(arr) {
      return mediaAlphaAsc(arr).reverse()
   }

   function mediaAddedAsc(arr) {
      return compareValues(arr, "addedOn")
   }

   function mediaAddedDes(arr) {
      return mediaAddedAsc(arr).reverse()
   }

   function mediaImdbAsc(arr) {
      return compareMediaValues(arr, "imdbRating")
   }

   function mediaImdbDes(arr) {
      return mediaImdbAsc(arr).reverse()
   }

   function mediaReleaseAsc(arr) {
      return compareMediaValues(arr, "releaseYear")
   }

   function mediaReleaseDes(arr) {
      return mediaReleaseAsc(arr).reverse()
   }
}

export async function fetchApi(url, method, values) {
   try {
      const response = await fetch(`/api/${url}`, {
         method: method.toUpperCase(),
         credentials: "include",
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
         },
         body: method === "get" ? undefined : JSON.stringify(values)
      })
      if (response.status === 500) throw Error("Server Unavailable")
      const apiResponse = await response.json()
      if (!apiResponse.success) {
         if (apiResponse.err === "no-user") throw Error("no-user")
         throw Error(apiResponse.err)
      }
      return apiResponse.result
   } catch (err) {
      if (err.message === "Failed to fetch") throw Error("You're offline")
      throw Error(err)
   }
}

export function basicFetch(
   url,
   method,
   values,
   loadingFunction,
   onSuccess,
   onFailure
) {
   loadingFunction(true)
   setTimeout(async () => {
      try {
         await fetchApi(url, method, values)
         if (onSuccess) {
            onSuccess()
         }
      } catch (e) {
         if (onFailure) {
            onFailure(e)
         }
      } finally {
         loadingFunction(false)
      }
   }, 1000)
}
