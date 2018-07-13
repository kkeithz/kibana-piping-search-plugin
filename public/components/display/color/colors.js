import { seedColors } from 'ui/vis/components/color/seed_colors'

export class Colors {
  static getColor(index){
    index = index % seedColors.length;
    return seedColors[index];
  }
};