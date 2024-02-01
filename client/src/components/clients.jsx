import { useQuery } from '@apollo/client';
import { Table, Card, Spin, Button, Modal } from 'antd';
import { DeleteOutlined, FileAddOutlined } from '@ant-design/icons';
import { GET_CLIENTS } from '../query/clientQuery';
import { useMutation } from '@apollo/client';
import { DELETE_CLIENTS } from '../mutations/clientMutations';
import { useState } from 'react';
import AddClientForm from './addClientForm';

const DeleteItem = ({ client }) => {
  const [deleteClient] = useMutation(DELETE_CLIENTS, {
    variables: { id: client.id },
    // refetchQueries: [{ query: GET_CLIENTS }],
    update(cache, { data: { deleteClient } }) {
      const { clients } = cache.readQuery({ query: GET_CLIENTS });

      cache.writeQuery({
        query: GET_CLIENTS,
        data: {
          clients: clients.filter((client) => client.id !== deleteClient.id),
        },
      });
    },
  });

  return <DeleteOutlined onClick={deleteClient} style={{ color: 'red' }} />;
};

const Clients = () => {
  const [addClientModal, setAddClientModal] = useState(false);

  const { loading, error, data } = useQuery(GET_CLIENTS);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Delete',
      key: 'button',
      render: (item) => <DeleteItem client={item} />,
    },
  ];

  if (loading) return <Spin />;
  if (error) return <p>Something went wrong</p>;

  return (
    <Card>
      <Button
        type='primary'
        onClick={() => setAddClientModal(!addClientModal)}
        style={{ marginBottom: '10px' }}
      >
        {' '}
        <FileAddOutlined /> Add Client
      </Button>

      <Table rowKey={'id'} dataSource={data.clients} columns={columns} />

      <Modal open={addClientModal} title='Add Client' footer={false}>
        <AddClientForm closeModal={() => setAddClientModal(false)} />
      </Modal>
    </Card>
  );
};

export default Clients;
