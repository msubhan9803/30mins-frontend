import PostLoginLayout from '@root/components/layout/post-login';
import LiveChat from 'components/PostLogin/LiveChat';
import {GetServerSideProps} from 'next';
import {getSession} from 'next-auth/react';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import ChatMutation from 'constants/GraphQL/LiveChat/mutations';

const Chat = ({newConvId, messageErr}) => (
  <PostLoginLayout>
    <LiveChat newConvId={newConvId} messageErr={messageErr} />
  </PostLoginLayout>
);

export default Chat;
Chat.auth = true;

export const getServerSideProps: GetServerSideProps = async context => {
  const membersEmail = context?.query?.membersEmail;
  const session = await getSession(context);
  let newConvId = null;

  if (membersEmail) {
    const data = await graphqlRequestHandler(
      ChatMutation.CreateConversation,
      {membersEmail: membersEmail},
      session?.accessToken
    );
    if (data?.data?.data?.createConversation?.response?.status === 400) {
      return {
        props: {
          newConvId,
          messageErr: data?.data?.data?.createConversation?.response?.message,
        },
      };
    }
    newConvId = data.data.data.createConversation.conversationID;
  }

  return {
    props: {
      newConvId,
      messageErr: null,
    },
  };
};
