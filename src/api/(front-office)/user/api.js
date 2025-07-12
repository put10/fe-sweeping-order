import { createApiRequest } from "@/api/base/api-factory";

export const userApi = {
  createUser: createApiRequest({
    endpoint: "/users",
    method: "POST",
  }),

  getAllUsers: createApiRequest({
    endpoint: "/users",
    method: "GET",
  }),

  getUserById: (id_user) => {
    return createApiRequest({
      endpoint: `/users/${id_user}`,
      method: "GET",
    })();
  },

  updateUser: (data) => {
    const { id_user, ...updateData } = data;
    return createApiRequest({
      endpoint: `/users/${id_user}`,
      method: "PUT",
    })(updateData);
  },

  deleteUser: (id_user) => {
    return createApiRequest({
      endpoint: `/users/${id_user}`,
      method: "DELETE",
    })();
  },

  filterUsers: (search, role) => {
    let endpoint = "/users";
    const params = [];

    if (search) params.push(`search=${search}`);
    if (role) params.push(`role=${role}`);

    if (params.length > 0) {
      endpoint += `?${params.join("&")}`;
    }

    return createApiRequest({
      endpoint,
      method: "GET",
    })();
  },
};
