import { getDocumentReviews } from '@/actions/get-all-document-reviews';
import { DataTable } from '@/components/dashboard/admin/document-review/DataTable';
import { columns } from '@/components/dashboard/admin/document-review/Columns';

type Props = {}

const page = async (props: Props) => {

  const reviews = await getDocumentReviews();


  return (
    <div className='p-12'>
        <DataTable columns={columns} data={reviews} />
    </div>
  )
}

export default page