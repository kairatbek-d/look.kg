import Axios from 'axios';

async function instagramPhotos () {
  // It will contain our photos' links
  const res = []
  
  try {
      const userInfoSource = await Axios.get('https://www.instagram.com/kairatbek_d/')

      // userInfoSource.data contains the HTML from Axios
      const jsonObject = userInfoSource.data.match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1)

      const userInfo = JSON.parse(jsonObject)
      console.log(userInfo)
      // Retrieve only the first 10 results
      const mediaArray = userInfo.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges.splice(0, 10)
      for (let media of mediaArray) {
          const node = media.node
          
          // Process only if is an image
          if ((node.__typename && node.__typename !== 'GraphImage')) {
              continue
          }

          // Push the thumbnail src in the array
          console.log(node.thumbnail_src)
          res.push(node.thumbnail_src)
      }
  } catch (e) {
      console.error('Unable to retrieve photos. Reason: ' + e.toString())
  }
  
  return res
}