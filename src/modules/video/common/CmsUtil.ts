import {CmsHomeClass} from "@/modules/video/impl/cms-json/VideoTypeForCmsJson.js";
import {VideoCategory} from "@/modules/video/VideoPlugin.js";
import {group, MapWrapper} from "@/utils/lang/ArrayUtil.js";

function classToCategory(c: CmsHomeClass): VideoCategory {
  return {
    id: c.type_id + '',
    name: c.type_name,
    cover: '',
    children: []
  }
}

const _tree = (node: VideoCategory, map: MapWrapper<number | undefined, Array<CmsHomeClass>>, cGroupMap: MapWrapper<number | undefined, Array<CmsHomeClass>>) => {
  let nodes = cGroupMap.getOrDefault(Number(node.id), []);
  node.children = nodes.map(e => classToCategory(e))
  node.children.forEach(n => _tree(n, map, cGroupMap));
}

export function cmsTreeTransfer(c: Array<CmsHomeClass>): Array<VideoCategory> {
  const cGroupMap = group(c, 'type_pid');
  const t = {
    id: '0',
    name: '',
    cover: '',
    children: []
  };
  _tree(t, cGroupMap, cGroupMap);
  return [...t.children, ...cGroupMap.getOrDefault(undefined, []).map(e => classToCategory(e))];
}