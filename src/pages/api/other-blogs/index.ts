import type {NextApiRequest, NextApiResponse} from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {data: slugList} = req.body;

    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
      query GetAllPosts($PostsBySlugs: [String]) {
        posts(
          where: {nameIn: $PostsBySlugs, orderby: {field: NAME_IN, order: ASC}}
        ) {
          nodes {
            databaseId
            title
            slug
            date
            content
            featuredImage {
              node {
                sourceUrl
              }
            }
            author {
              node {
                name
                avatar {
                  url
                }
              }
            }
            categories {
              nodes {
                name
              }
            }
          }
        }
      }
        `,
        variables: {
          PostsBySlugs: slugList,
        },
      }),
    };

    const response = await fetch('https://blog.30mins.com/graphql', params).then(resData =>
      resData.json()
    );
    const blogsData = response?.data?.posts?.nodes || [];

    res.status(200).send({blogsData});
    return;
  } catch (err) {
    res.status(500).send({message: 'Unknown Server Error', error: 'Unknown Server Error'});
  }
};

export default handler;
