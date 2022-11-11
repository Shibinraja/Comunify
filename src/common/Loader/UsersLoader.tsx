import { width_90 } from 'constants/constants';
import Skeleton from 'react-loading-skeleton';

export const UsersLoader = () => (
  <tr className="border-b ">
    <td className="px-3 py-4 ">
      <Skeleton width={width_90} />
    </td>
    <td className="px-3 py-4 ">
      <Skeleton width={width_90} />
    </td>
    <td className="px-3 py-4 ">
      <Skeleton width={width_90} />
    </td>
    <td className="px-3 py-4 ">
      <Skeleton width={width_90} />
    </td>
    <td className="px-3 py-4 ">
      <Skeleton width={width_90} />
    </td>
    <td className="px-3 py-4 ">
      <Skeleton width={width_90} />
    </td>
    <td className="px-3 py-4 ">
      <Skeleton width={width_90} />
    </td>
  </tr>
);
