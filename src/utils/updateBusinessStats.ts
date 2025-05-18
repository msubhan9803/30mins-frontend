import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import buisnessStatsMutations from 'constants/GraphQL/Statistics/mutations';
import dayjs from 'dayjs';

type Fields = {
  [key: string]: number;
};

const updateBuisnessStats = async (fields: Fields) => {
  await graphqlRequestHandler(
    buisnessStatsMutations.updateGlobalBusinessStats,
    {
      inputs: {
        fields: {
          ...fields,
        },
        timeStamp: dayjs().toISOString(),
      },
    },
    process.env.BACKEND_API_KEY
  );
};

export default updateBuisnessStats;
