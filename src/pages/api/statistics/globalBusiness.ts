import type {NextApiRequest, NextApiResponse} from 'next';
import updateBuisnessStats from 'utils/updateBusinessStats';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {fields} = req.body;

    await updateBuisnessStats(fields);

    res.status(200).json({message: 'updated Successfully'});
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Server Error'});
  }
};

export default handler;
