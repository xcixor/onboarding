import { Preview } from '@/components/Preview';
import { CoachReview } from '@prisma/client';

type Props = {
    review:CoachReview
}

const PreviousReview = ({review}: Props) => {
  return (
    <div>
        <Preview value={review.review}/>
    </div>
  )
}

export default PreviousReview