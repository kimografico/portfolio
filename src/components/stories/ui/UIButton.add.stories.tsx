import UIButton from '../../../components/ui/UIButton';

export default {
  title: 'UI/UIButton',
  component: UIButton,
};

export const AddButton = () => (
  <div style={{ padding: 16 }}>
    <UIButton addBtn dataId="story-btn-add">
      Añadir
    </UIButton>
  </div>
);
