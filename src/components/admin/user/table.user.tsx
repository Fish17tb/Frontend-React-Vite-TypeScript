/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { deleteUserAPI, getUsersAPI } from "@/services/api";
import { dateRangeValidate } from "@/services/helper";
import {
  CloudDownloadOutlined,
  DeleteTwoTone,
  EditTwoTone,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { App, Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import DetailUser from "./detail.user";
import CreateUser from "./create.user";
import ImportUser from "./data/import.user";
import { CSVLink } from "react-csv";
import UpdateUser from "./update.user";

type TSearch = {
  fullName: string;
  email: string;
  createdAt: string;
  createdAtRange: string;
};

const TableUser = () => {
  const actionRef = useRef<ActionType>();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });

  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
  const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);

  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

  const [openModalImport, setOpenModalImport] = useState<boolean>(false);

  const [currentDataTable, setCurrentDataTable] = useState<IUserTable[]>([]);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);

  const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);

  const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);

  const { message, notification } = App.useApp();

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  const handleDeleteUser = async (_id: string) => {
    setIsDeleteUser(true);
    const res = await deleteUserAPI(_id);
    if (res && res.data) {
      message.success("Xóa user thành công");
      refreshTable();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
    setIsDeleteUser(false);
  };

  const columns: ProColumns<IUserTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "_id",
      dataIndex: "_id",
      hideInSearch: true,
      render(_dom, entity, _index, _action, _schema) {
        return (
          <a
            onClick={() => {
              setOpenViewDetail(true);
              setDataViewDetail(entity);
            }}
            href="#"
          >
            {entity._id}
          </a>
        );
      },
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      copyable: true,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      hideInSearch: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAtRange",
      valueType: "dateRange",
      hideInTable: true,
    },
    {
      title: "Action",
      hideInSearch: true,
      render(_dom, entity, _index, _action, _schema) {
        return (
          <>
            <EditTwoTone
              twoToneColor="#f57800"
              style={{ cursor: "pointer", marginRight: 15 }}
              onClick={() => {
                setDataUpdate(entity);
                setOpenModalUpdate(true);
              }}
            />
            <Popconfirm
              title="Xác nhận xóa user"
              description="Bạn có chắc chắn muốn xóa user này không?"
              okText="Xác nhận"
              cancelText="Hủy"
              placement="leftTop"
              onConfirm={() => handleDeleteUser(entity._id)}
              okButtonProps={{ loading: isDeleteUser }}
            >
              <span style={{ cursor: "pointer", marginLeft: 20 }}>
                <DeleteTwoTone
                  twoToneColor="#ff4d4f"
                  style={{ cursor: "pointer" }}
                />
              </span>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <>
      <ProTable<IUserTable, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log(params, sort, filter);

          // query
          let query = "";
          if (params) {
            query += `current=${params.current}&pageSize=${params.pageSize}`;
            if (params.email) {
              query += `&email=/${params.email}/i`;
            }
            if (params.fullName) {
              query += `&fullName=/${params.fullName}/i`;
            }

            const createDateRange = dateRangeValidate(params.createdAtRange);
            if (createDateRange) {
              query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`;
            }

            if (sort && sort.createdAt) {
              query += `&sort=${
                sort.createdAt === "ascend" ? "createdAt" : "-createdAt"
              }`;
            } else {
              query += `&sort=-createdAt`;
            }
          }

          const res = await getUsersAPI(query);
          if (res.data) {
            setMeta(res.data.meta);
            setCurrentDataTable(res.data?.result ?? []);
          }
          return {
            data: res.data?.result,
            page: 1,
            success: true,
            total: res.data?.meta.total,
          };
        }}
        rowKey="_id"
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]} - {range[1]} of {total} items
              </div>
            );
          },
        }}
        dateFormatter="string"
        headerTitle="Table user"
        toolBarRender={() => [
          <Button key="button" icon={<ExportOutlined />} type="primary">
            <CSVLink data={currentDataTable} filename="export-user.csv">
              Export
            </CSVLink>
          </Button>,
          <Button
            key="button"
            icon={<CloudDownloadOutlined />}
            onClick={() => setOpenModalImport(true)}
            type="primary"
          >
            Import
          </Button>,
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => setOpenModalCreate(true)}
            type="primary"
          >
            Add new
          </Button>,
        ]}
      />
      <DetailUser
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
      <CreateUser
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />
      <ImportUser
        openModalImport={openModalImport}
        setOpenModalImport={setOpenModalImport}
        refreshTable={refreshTable}
      />
      <UpdateUser
        dataUpdate={dataUpdate}
        openModalUpdate={openModalUpdate}
        refreshTable={refreshTable}
        setDataUpdate={setDataUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
      />
    </>
  );
};

export default TableUser;
