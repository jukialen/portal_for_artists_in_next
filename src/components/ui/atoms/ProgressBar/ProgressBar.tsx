import { Progress } from '@ark-ui/react/progress';
import styles from './ProgressBar.module.css';

export const ProgressBar = ({ value }: { value: number }) => (
  <Progress.Root
    defaultValue={0}
    min={0}
    max={100}
    value={value}
    translations={{
      value({ value, max }) {
        if (value === null || value === 0) return 'Loading...';
        return `${value} of ${max} items loaded`;
      },
    }}
    className={styles.progressbar}>
    <Progress.Label></Progress.Label>
    <Progress.ValueText />
    <Progress.Track>
      <Progress.Range />
    </Progress.Track>
  </Progress.Root>
);
