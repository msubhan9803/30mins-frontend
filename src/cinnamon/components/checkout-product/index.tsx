import mutations from 'constants/GraphQL/Products/mutations';
import queries from 'constants/GraphQL/Products/queries';
import {useMutation, useQuery} from '@apollo/client';
import Loader from 'components/shared/Loader/Loader';
import {useSession} from 'next-auth/react';
import {useContext, useEffect, useState} from 'react';
import {toast} from 'react-hot-toast';
import useTranslation from 'next-translate/useTranslation';
import {UserContext} from '@root/context/user';
import Button from '../button';

export default function CheckoutProduct({id, refetchList}) {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const {refItems} = useContext(UserContext);
  const [addCart] = useMutation(mutations.addCart, {variables: {}});
  const [deleteCart] = useMutation(mutations.deleteCart, {variables: {}});

  const {
    data: {
      getProductQttById: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        productQtt: {_id, quantity, product},
      },
    } = {
      getProductQttById: {
        productQtt: {_id: '', quantity: 1, product: null},
      },
    },
    loading,
    refetch,
  } = useQuery(queries.getProductQttById, {
    variables: {token: session?.accessToken, documentId: id},
  });

  const [qtt, setQtt] = useState(1);
  const [Loading, setLoading] = useState(false);

  const AddToCart = async (productId, Qtt) => {
    const idToast = toast.loading(t('common:loading'));
    setLoading(true);

    await addCart({
      variables: {
        productId: productId,
        quantity: Number(Qtt),
        token: session?.accessToken,
      },
    });
    await refetch({token: session?.accessToken, documentId: id});
    setLoading(false);
    await refItems();
    toast.dismiss(idToast);
  };

  useEffect(() => {
    setQtt(Number(quantity));
  }, [quantity]);

  if (loading) {
    return <Loader />;
  }
  return (
    <div className='w-full flex flex-col sm:flex-row border gap-2'>
      <div className='flex flex-row w-full sm:w-full gap-2'>
        <div className=''>
          <img src={product?.image} alt='' className='w-12 h-12' />
        </div>
        <div className='flex flex-col'>
          <span>{product?.title}</span>
          <span>
            $
            {(
              Number(product?.price) -
              (Number(product?.price) * Number(product?.discount)) / 100
            ).toFixed(2)}
          </span>
        </div>
      </div>
      <div className='flex flex-row w-full gap-2 justify-center pr-1 pb-1 sm:pb-0 items-center sm:w-max h-[90%] my-auto'>
        <span className='border overflow-hidden rounded-md flex flex-row'>
          <button
            className='p-2 bg-gray-200 hover:bg-gray-300 text-base font-bold'
            onClick={() => {
              if (qtt > 1) setQtt(qtt - 1);
            }}
          >
            -
          </button>
          <input
            type='number'
            defaultValue={1}
            maxLength={2}
            min={1}
            value={qtt}
            max={1000}
            onChange={({target: {value}}) => {
              if (Number(value) < 1) {
                // set 1
                setQtt(1);
                return;
              }
              if (Number(value) > 1000) {
                // set 1000
                setQtt(1000);
                return;
              }
              setQtt(Number(value));
            }}
            className='border-0 w-12 text-center p-1'
          />
          <button
            className='p-2 bg-gray-200 hover:bg-gray-300 text-base font-bold'
            onClick={() => {
              if (qtt < 1000) setQtt(qtt + 1);
            }}
          >
            +
          </button>
        </span>
        <Button
          variant='solid'
          onClick={async () => {
            await AddToCart(product?._id, qtt);
            await refItems();
          }}
          disabled={qtt === Number(quantity) || Loading}
        >
          Update
        </Button>
        <Button
          disabled={Loading}
          variant='cancel'
          onClick={async () => {
            const idToast = toast.loading(t('common:loading'));
            setLoading(true);
            await deleteCart({
              variables: {
                token: session?.accessToken,
                productQttId: _id,
              },
            });
            await refetchList();
            await refItems();
            setLoading(false);
            toast.dismiss(idToast);
          }}
        >
          X
        </Button>
      </div>
    </div>
  );
}
