<script setup>
import { ref, computed, onMounted } from 'vue';
import Navbar from '@/components/common/Navbar.vue';
import Avatar from 'primevue/avatar';
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import FileUpload from 'primevue/fileupload';
import Message from 'primevue/message';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();


const isEditing = ref(false);
const loading = ref(false);
const error = ref('');
const success = ref('');

const formData = ref({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    avatar: null
});

const fileName = ref('');


const user = computed(() => authStore.user);
const isAuthenticated = computed(() => authStore.isAuthenticated);

onMounted(async () => {
    if (isAuthenticated.value) {
        await authStore.fetchCurrentUser();
        resetForm();
    }
});

const resetForm = () => {
    if (user.value) {
        formData.value = {
            fullname: user.value.fullname || '',
            email: user.value.email || '',
            phone: user.value.phone || '',
            password: '',
            avatar: null
        };
        fileName.value = '';
    }
};

const toggleEdit = () => {
    isEditing.value = !isEditing.value;
    if (!isEditing.value) {
        resetForm();
    }
};

const onFileSelect = (event) => {
    const file = event.files[0];
    formData.value.avatar = file;
    fileName.value = file.name;
};

const handleUpdateProfile = async () => {
    loading.value = true;
    error.value = '';
    success.value = '';

    const data = new FormData();
    if (formData.value.fullname) data.append('fullname', formData.value.fullname);
    if (formData.value.email) data.append('email', formData.value.email);
    if (formData.value.phone) data.append('phone', formData.value.phone);
    if (formData.value.password) data.append('password', formData.value.password);
    if (formData.value.avatar) data.append('avatar', formData.value.avatar);

    const result = await authStore.updateProfile(user.value.id, data);

    if (result.success) {
        success.value = 'Cập nhật thông tin thành công!';
        isEditing.value = false;
        await authStore.fetchCurrentUser();
    } else {
        error.value = result.message;
    }
    loading.value = false;
};
</script>

<template>
  <div class="min-h-screen bg-[#f1f5f9] text-slate-900">
    <Navbar />
    
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card v-if="user" class="shadow-xl border-0 !bg-white overflow-hidden rounded-[2rem]">
        <template #content>
          <div class="text-center mb-12">
            <div class="relative inline-block group">
                <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <Avatar
                    v-if="user.avatar"
                    :image="user.avatar"
                    size="xlarge"
                    shape="circle"
                    class="relative w-36 h-36 mb-6 border-4 border-white shadow-xl object-cover"
                />
                <Avatar
                    v-else
                    :label="user?.username?.charAt(0).toUpperCase()"
                    size="xlarge"
                    shape="circle"
                    class="relative w-36 h-36 mb-6 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white text-6xl flex items-center justify-center shadow-xl font-black"
                />
            </div>
            <h1 class="text-5xl font-black text-slate-900 mb-3 tracking-tighter">
              {{ user?.username }}
            </h1>
            <div class="inline-flex items-center px-6 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold uppercase tracking-widest border border-indigo-100">
              {{ user?.role }}
            </div>
          </div>
          
          <Message v-if="error" severity="error" class="mb-6">{{ error }}</Message>
          <Message v-if="success" severity="success" class="mb-6">{{ success }}</Message>

          <div v-if="!isEditing" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-6 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:shadow-md hover:border-indigo-100">
                    <span class="block text-xs font-black uppercase tracking-[0.2em] text-indigo-500 mb-2">Tên đầy đủ</span>
                    <span class="text-xl font-bold text-slate-800">{{ user?.fullname || 'Chưa cập nhật' }}</span>
                </div>
                
                <div class="p-6 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:shadow-md hover:border-indigo-100 overflow-hidden">
                    <span class="block text-xs font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Email</span>
                    <span class="text-xl font-bold text-slate-800 block truncate" :title="user?.email">{{ user?.email || 'Chưa cập nhật' }}</span>
                </div>

                <div class="p-6 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:shadow-md hover:border-indigo-100">
                    <span class="block text-xs font-black uppercase tracking-[0.2em] text-indigo-500 mb-2">Số điện thoại</span>
                    <span class="text-xl font-bold text-slate-800">{{ user?.phone || 'Chưa cập nhật' }}</span>
                </div>

                <div class="p-6 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:shadow-md hover:border-indigo-100">
                    <span class="block text-xs font-black uppercase tracking-[0.2em] text-indigo-500 mb-2">Ngày tham gia</span>
                    <span class="text-xl font-bold text-slate-800">
                        {{ user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'Đang cập nhật...' }}
                    </span>
                </div>
            </div>

            <div class="flex justify-center mt-10">
                <Button 
                    label="Chỉnh sửa thông tin" 
                    icon="pi pi-user-edit" 
                    class="p-button-raised !bg-indigo-600 hover:!bg-indigo-700 border-0 px-8 py-4 rounded-2xl font-bold transition-all transform hover:scale-105"
                    @click="toggleEdit" 
                />
            </div>
          </div>

          <form v-else @submit.prevent="handleUpdateProfile" class="space-y-8 px-2">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="flex flex-col gap-3">
                    <label for="fullname" class="text-sm font-bold text-slate-500 uppercase tracking-wider">Họ và tên</label>
                    <InputText id="fullname" v-model="formData.fullname" placeholder="Nhập họ và tên" class="w-full !bg-slate-50 !border-slate-200 !text-slate-900 focus:!border-indigo-500 rounded-xl" />
                </div>

                <div class="flex flex-col gap-3">
                    <label for="email" class="text-sm font-bold text-slate-500 uppercase tracking-wider">Email</label>
                    <InputText id="email" v-model="formData.email" type="email" placeholder="example@gmail.com" class="w-full !bg-slate-50 !border-slate-200 !text-slate-900 focus:!border-indigo-500 rounded-xl" />
                </div>

                <div class="flex flex-col gap-3">
                    <label for="phone" class="text-sm font-bold text-slate-500 uppercase tracking-wider">Số điện thoại</label>
                    <InputText id="phone" v-model="formData.phone" placeholder="Nhập số điện thoại" class="w-full !bg-slate-50 !border-slate-200 !text-slate-900 focus:!border-indigo-500 rounded-xl" />
                </div>

                <div class="flex flex-col gap-3">
                    <label for="password" class="text-sm font-bold text-slate-500 uppercase tracking-wider">Mật khẩu mới (để trống nếu không đổi)</label>
                    <Password id="password" v-model="formData.password" toggleMask :feedback="false" placeholder="••••••••" class="w-full" inputClass="w-full !bg-slate-50 !border-slate-200 !text-slate-900 focus:!border-indigo-500 rounded-xl" />
                </div>

                <div class="md:col-span-2 flex flex-col gap-3">
                    <label class="text-sm font-bold text-slate-500 uppercase tracking-wider">Ảnh đại diện</label>
                    <div class="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                        <FileUpload
                            mode="basic"
                            @select="onFileSelect"
                            accept="image/*"
                            :maxFileSize="1000000"
                            label="Chọn ảnh"
                            chooseLabel="Chọn ảnh mới"
                            class="p-button-outlined !border-indigo-200 !text-indigo-600 hover:!bg-indigo-50"
                        />
                        <span v-if="selectedFile" class="text-sm font-medium text-emerald-600 flex items-center gap-2">
                            <i class="pi pi-check-circle"></i> {{ selectedFile.name }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="flex justify-center gap-4 mt-10">
                <Button
                    label="Hủy"
                    icon="pi pi-times"
                    severity="secondary"
                    outlined
                    class="px-8 py-4 rounded-2xl font-bold border-slate-200 hover:bg-slate-50"
                    @click="toggleEdit"
                />
                <Button
                    type="submit"
                    label="Lưu thay đổi"
                    icon="pi pi-check"
                    :loading="loading"
                    class="p-button-raised !bg-emerald-600 hover:!bg-emerald-700 border-0 px-8 py-4 rounded-2xl font-bold transition-all transform hover:scale-105"
                />
            </div>
          </form>
        </template>
      </Card>
      
      <div v-else class="flex flex-col items-center justify-center py-24 bg-white rounded-[2rem] shadow-sm">
          <i class="pi pi-user-slash text-6xl text-slate-200 mb-4"></i>
          <p class="text-slate-500 font-medium">Vui lòng đăng nhập để xem thông tin</p>
          <Button label="Đăng nhập ngay" icon="pi pi-sign-in" text class="mt-4 !text-indigo-600 font-bold" @click="router.push('/login')" />
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-card) {
    background-color: transparent !important;
}

:deep(.p-inputtext), :deep(.p-password-input) {
    padding: 1rem 1.25rem !important;
}

:deep(.p-button) {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
