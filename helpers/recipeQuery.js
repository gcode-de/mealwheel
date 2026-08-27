import { filterTags } from "./filterTags";

export function createEmptyFilters() {
  return filterTags.reduce((filters, { type }) => {
    filters[type] = [];
    return filters;
  }, {});
}

export function createUrlWithParams(
  baseUrl,
  filters = null,
  sort = null,
  search = ""
) {
  let url = baseUrl;
  const queryParams = [];

  if (filters) {
    Object.entries(filters).forEach(([type, values]) => {
      if (values.length > 0) {
        queryParams.push(
          `${type}=${values.map(encodeURIComponent).join(",")}`
        );
      }
    });
  }

  if (sort?.type && sort?.order) {
    queryParams.push(
      `sort=${encodeURIComponent(sort.type)}&order=${encodeURIComponent(
        sort.order
      )}`
    );
  }

  if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
  if (queryParams.length > 0) url += `?${queryParams.join("&")}`;

  return url;
}
