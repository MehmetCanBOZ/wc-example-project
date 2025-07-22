import { html } from 'lit';
import '../src/employee-management.js';

export default {
  title: 'EmployeeManagement',
  component: 'employee-management',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ header, backgroundColor }) {
  return html`
    <employee-management
      style="--employee-management-background-color: ${backgroundColor ||
      'white'}"
      .header=${header}
    >
    </employee-management>
  `;
}

export const App = Template.bind({});
App.args = {
  header: 'My app',
};
