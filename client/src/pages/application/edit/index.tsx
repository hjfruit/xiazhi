import type {
  ActionType,
  ParamsType,
  ProColumns,
} from '@ant-design/pro-components'
import { ProCard, ProTable } from '@ant-design/pro-components'
import { Tag, Button, Empty, message, Space, Table } from 'antd'
import React, { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { useGetAppInfoByIdQuery } from '@/graphql/operations/__generated__/app.generated'
import {
  useChangeEntryAccessStatusMutation,
  useDeleteEntriesMutation,
  usePageAppEntriesLazyQuery,
  useUploadEntriesXlsxMutation,
} from '@/graphql/operations/__generated__/entry.generated'
import { EntryItem } from '@/graphql/generated/types'
import EntryModal from '@/pages/entry/components/entry-modal'
import EntryForm from '@/pages/entry/components/entry-form'
import TransformEntryModal, {
  TransformEntryModalRefProps,
} from '@/pages/entry/components/transform-entry-modal'
import ModifyRecordsModal from '@/pages/entry/components/modify-record-modal'
import config from '@/config'
import { appTypeOptions } from '../constant'
import UploadXlsx from '../components/upload-xlsx'
import styles from './index.module.less'

type EntryListProps = {
  selectedEntry: EntryItem
  languageArray: string[]
  onResetCurrent: () => void
  onChange: (entry: EntryItem) => void
  actionRef: React.MutableRefObject<ActionType>
}

const EntryList: React.FC<EntryListProps> = ({
  onChange,
  onResetCurrent,
  selectedEntry,
  languageArray,
  actionRef,
}) => {
  const routeParams = useParams()
  const appId = Number(routeParams.id)

  const transformEntryRef = useRef<TransformEntryModalRefProps>(null)

  const [pageAllPublicEntries] = usePageAppEntriesLazyQuery()
  const [changeEntryAccess] = useChangeEntryAccessStatusMutation()
  const [deleteEntries] = useDeleteEntriesMutation()
  const [uploadXlxs] = useUploadEntriesXlsxMutation()

  async function handleMultiDelete(entryIds: number[], onSuccess?: () => void) {
    await deleteEntries({
      variables: {
        entryIds,
        appId,
      },
    })
    onSuccess?.()
  }

  async function handleChangeEntryAccess(
    type: 'archive' | 'deleted',
    row: EntryItem,
  ) {
    await changeEntryAccess({
      variables: {
        entryId: row.entry_id,
        appId,
        [type]: true,
      },
    })
    message.success('操作成功！')
    actionRef.current?.reload()
  }

  async function handleUploadEntries(url: string, callback: () => void) {
    await uploadXlxs({
      variables: {
        fileUrl: url,
        appId,
      },
    })
    actionRef.current.reload()
    message.success('导入词条成功！')
    callback()
  }

  async function handleRollbackSuccess() {
    await actionRef.current?.reload()
    selectedEntry && onChange?.(null)
  }

  async function handleRequest(
    params: ParamsType & {
      pageSize?: number
      current?: number
      keyword?: string
    } = {},
  ) {
    const res = await pageAllPublicEntries({
      variables: {
        pageNo: params.current,
        pageSize: params.pageSize,
        appId,
        startTime: params.startTime,
        endTime: params.endTime,
        key: params.key,
        mainLangText: params.mainLangText,
        latest: (params.state as any[])?.includes('latest'),
        archive: (params.state as any[])?.includes('archived'),
      },
    })
    const data = res?.data?.pageAppEntries
    return {
      data: data.records,
      success: true,
      total: data.total,
    }
  }

  const columns: ProColumns<EntryItem>[] = [
    {
      title: '词条Key',
      dataIndex: 'key',
      copyable: true,
      width: 200,
      render(dom, entity) {
        return (
          <Space>
            <div style={{ width: 200 }}> {dom}</div>
            {entity.archive ? <Tag color="#f50">已归档</Tag> : null}
          </Space>
        )
      },
    },
    {
      title: '主语言',
      dataIndex: 'mainLangText',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      width: 200,
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      width: 200,
      dataIndex: 'createdAt',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: value => {
          return {
            startTime: dayjs(value[0]).valueOf(),
            endTime: dayjs(value[1]).valueOf(),
          }
        },
      },
    },
    {
      title: '高级筛选',
      dataIndex: 'state',
      valueType: 'checkbox',
      hideInTable: true,
      valueEnum: {
        latest: {
          text: '最近上传',
          disabled: true,
        },
        archived: {
          text: '已归档',
        },
      },
    },
    {
      title: '最近修改',
      key: 'updateTime',
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
      width: 200,
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '词条修改记录',
      key: 'updateTime',
      width: 120,
      dataIndex: 'modifyRecords',
      hideInSearch: true,
      render(_, record) {
        const { entry_id, langs, key, modifyRecords } = record
        return (
          <ModifyRecordsModal
            onRollbackSuccess={handleRollbackSuccess}
            records={{ entry_id, appId, langs, key }}
            modifyRecords={modifyRecords || []}
          />
        )
      },
    },
    {
      title: '操作',
      key: 'operation',
      valueType: 'option',
      width: 180,
      tooltip: '归档和删除都属于不可逆操作，请谨慎使用',
      render: (_, row) => [
        row.archive ? null : (
          <a
            key="achieve"
            onClick={async () => {
              await handleChangeEntryAccess('archive', row)
              onChange?.(null)
            }}>
            归档
          </a>
        ),
        <a
          key="delete"
          onClick={async () => {
            await handleChangeEntryAccess('deleted', row)
            onChange?.(null)
          }}>
          删除
        </a>,
        <a
          key="transform"
          onClick={() => {
            transformEntryRef.current?.open({
              currentAppId: +routeParams.id,
              entryId: row.entry_id,
              langObj: row.langs,
              key: row.key,
            })
          }}>
          转换
        </a>,
      ],
    },
  ]

  return (
    <>
      <ProTable<EntryItem>
        actionRef={actionRef}
        columns={columns}
        request={handleRequest}
        rowKey="entry_id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
        }}
        rowClassName={record => {
          return record?.entry_id === selectedEntry?.entry_id
            ? styles['split-row-select-active']
            : ''
        }}
        toolbar={{
          actions: [
            <Button
              size="small"
              key="list"
              type="link"
              onClick={() =>
                window.open(`${config.apiHost}/assets/template.xlsx`)
              }>
              下载多语言模版
            </Button>,
            <UploadXlsx key="upload" onUploadSuccess={handleUploadEntries} />,
            <EntryModal
              initialFormData={{
                appId: Number(appId),
              }}
              supportLanguageArray={languageArray || []}
              key="add"
              onActionSuccess={() => {
                actionRef.current.reload()
              }}>
              <Button size="small" type="primary">
                新增词条
              </Button>
            </EntryModal>,
          ],
        }}
        onRow={record => {
          if (record.archive) {
            return {}
          }
          return {
            onClick: () => {
              if (record.entry_id) {
                onChange(record)
              }
            },
          }
        }}
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          defaultSelectedRowKeys: [],
        }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => {
          return (
            <Space size={24}>
              <span>
                已选 {selectedRowKeys.length} 项
                <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                  取消选择
                </a>
              </span>
            </Space>
          )
        }}
        tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => {
          return (
            <a
              onClick={() =>
                handleMultiDelete(selectedRowKeys as number[], () => {
                  onCleanSelected()
                  actionRef.current.reload()
                  // 当被选中的包含在删除列表中，清空表格
                  if (
                    selectedEntry &&
                    selectedRowKeys.includes(selectedEntry.entry_id)
                  ) {
                    onChange?.(null)
                  }
                })
              }>
              批量删除
            </a>
          )
        }}
      />
      <TransformEntryModal
        ref={transformEntryRef}
        onResetCurrent={onResetCurrent}
        onActionSuccess={() => actionRef.current.reload()}
      />
    </>
  )
}

const AppEntryEditPage: React.FC = () => {
  const params = useParams()

  const [current, setCurrent] = useState<EntryItem>()
  const actionRef = useRef<ActionType>()

  const { data } = useGetAppInfoByIdQuery({
    variables: {
      getAppInfoByIdId: Number(params.id),
    },
  })

  function reloadTableList() {
    actionRef.current?.reload()
  }

  const currentType = appTypeOptions.find(
    item => item.value === data?.getAppInfoById?.type,
  )

  return (
    <ProCard
      split="vertical"
      title={data?.getAppInfoById?.name}
      subTitle={[
        <Tag key="label" color="#2db7f5">
          {currentType?.label}
        </Tag>,
      ]}>
      <ProCard colSpan={16} ghost>
        <EntryList
          actionRef={actionRef}
          onChange={currentItem => {
            setCurrent(currentItem)
          }}
          onResetCurrent={() => {
            setCurrent(null)
          }}
          languageArray={data?.getAppInfoById?.languages}
          selectedEntry={current}
        />
      </ProCard>
      <ProCard colSpan={8} title={current?.mainLangText}>
        {current ? (
          <EntryForm
            onActionSuccess={reloadTableList}
            initialFormData={{
              ...current,
              ...current.langs,
              entryId: current.entry_id,
              appId: Number(params.id),
            }}
            supportLanguageArray={data?.getAppInfoById?.languages || []}
          />
        ) : (
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
              height: 60,
            }}
            description={
              <span>
                请在左侧表格选择词条编辑或是{' '}
                <EntryModal
                  initialFormData={{ appId: Number(params.id) }}
                  supportLanguageArray={data?.getAppInfoById?.languages || []}
                  onActionSuccess={reloadTableList}>
                  <a>新增词条</a>
                </EntryModal>
              </span>
            }
          />
        )}
      </ProCard>
    </ProCard>
  )
}

export default AppEntryEditPage
