import SelectDistributionPeriodInput, { type SelectDistributionPeriodInputProps } from './SelectDistributionPeriodInput';
import { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

export default {
  title: 'incentivize/SelectDistributionPeriodInput',
  component: SelectDistributionPeriodInput,
} as Meta<typeof SelectDistributionPeriodInput>;

export const Default: StoryObj<SelectDistributionPeriodInputProps> = {
  args: {
    title: 'Start Date',
    date: {
      year: 2023,
      month: 10,
      date: 1
    },
    setDate: action('date')
  },
};