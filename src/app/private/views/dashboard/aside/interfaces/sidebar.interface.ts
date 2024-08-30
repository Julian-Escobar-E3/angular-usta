export default interface IMenuOptions {
  id: string;
  name: string;
  icon: string;
  path: string;
  childrens?: IMenuOptions[];
}
