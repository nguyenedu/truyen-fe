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

// State
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

// Use computed to ensure reactivity
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
  <div class="min-h-screen bg-[#0f172a] text-gray-100">
    <Navbar />
    
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card v-if="user" class="shadow-2xl border-0 !bg-[#1e293b] overflow-hidden rounded-[2rem]">
        <template #content>
          <div class="text-center mb-12">
            <div class="relative inline-block group">
                <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-60 transition duration-1000"></div>
                <Avatar
                    v-if="user.avatar"
                    :image="user.avatar"
                    size="xlarge"
                    shape="circle"
                    class="relative w-36 h-36 mb-6 border-4 border-[#334155] shadow-2xl object-cover"
                />
                <Avatar
                    v-else
                    :label="user?.username?.charAt(0).toUpperCase()"
                    size="xlarge"
                    shape="circle"
                    class="relative w-36 h-36 mb-6 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white text-6xl flex items-center justify-center shadow-2xl font-black"
                />
            </div>
            <h1 class="text-5xl font-black text-white mb-3 tracking-tighter">
              {{ user?.username }}
            </h1>
            <div class="inline-flex items-center px-6 py-2 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-bold uppercase tracking-widest border border-indigo-500/30">
              {{ user?.role }}
            </div>
          </div>
          
          <Message v-if="error" severity="error" class="mb-6 !bg-red-900/20 !border-red-500/50 !text-red-200">{{ error }}</Message>
          <Message v-if="success" severity="success" class="mb-6 !bg-emerald-900/20 !border-emerald-500/50 !text-emerald-200">{{ success }}</Message>

          <div v-if="!isEditing" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-6 bg-[#334155]/40 rounded-3xl border border-white/5 transition-all hover:bg-[#334155]/60">
                    <span class="block text-xs font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Tên đầy đủ</span>
                    <span class="text-xl font-bold text-white">{{ user?.fullname || 'Chưa cập nhật' }}</span>
                </div>
                
                <div class="p-6 bg-[#334155]/40 rounded-3xl border border-white/5 transition-all hover:bg-[#334155]/60 overflow-hidden">
                    <span class="block text-xs font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Email</span>
                    <span class="text-xl font-bold text-white block truncate" :title="user?.email">{{ user?.email || 'Chưa cập nhật' }}</span>
                </div>

                <div class="p-6 bg-[#334155]/40 rounded-3xl border border-white/5 transition-all hover:bg-[#334155]/60">
                    <span class="block text-xs font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Số điện thoại</span>
                    <span class="text-xl font-bold text-white">{{ user?.phone || 'Chưa cập nhật' }}</span>
                </div>

                <div class="p-6 bg-[#334155]/40 rounded-3xl border border-white/5 transition-all hover:bg-[#334155]/60">
                    <span class="block text-xs font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Ngày tham gia</span>
                    <span class="text-xl font-bold text-white">
                        {{ user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'Đang cập nhật...' }}
                    </span>
                </div>
            </div>

            <div class="flex justify-center mt-10">
                <Button 
                    label="Chỉnh sửa thông tin" 
                    icon="pi pi-user-edit" 
                    class="p-button-raised !bg-indigo-600 hover:!bg-indigo-500 border-0 px-8 py-4 rounded-2xl font-bold transition-all transform hover:scale-105"
                    @click="toggleEdit" 
                />
            </div>
          </div>

          <form v-else @submit.prevent="handleUpdateProfile" class="space-y-8 px-2">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="flex flex-col gap-3">
                    <label for="fullname" class="text-sm font-bold text-gray-300 uppercase tracking-wider">Họ và tên</label>
                    <InputText id="fullname" v-model="formData.fullname" placeholder="Nhập họ và tên" class="w-full !bg-[#0f172a] !border-white/10 !text-white focus:!border-indigo-500 rounded-xl" />
                </div>

                <div class="flex flex-col gap-3">
                    <label for="email" class="text-sm font-bold text-gray-300 uppercase tracking-wider">Email</label>
                    <InputText id="email" v-model="formData.email" type="email" placeholder="example@gmail.com" class="w-full !bg-[#0f172a] !border-white/10 !text-white focus:!border-indigo-500 rounded-xl" />
                </div>

                <div class="flex flex-col gap-3">
                    <label for="phone" class="text-sm font-bold text-gray-300 uppercase tracking-wider">Số điện thoại</label>
                    <InputText id="phone" v-model="formData.phone" placeholder="Số điện thoại" class="w-full !bg-[#0f172a] !border-white/10 !text-white focus:!border-indigo-500 rounded-xl" />
                </div>

                <div class="flex flex-col gap-3">
                    <label for="password" class="text-sm font-bold text-gray-300 uppercase tracking-wider">Mật khẩu mới</label>
                    <Password id="password" v-model="formData.password" :feedback="false" toggleMask placeholder="••••••" class="w-full" inputClass="w-full !bg-[#0f172a] !border-white/10 !text-white focus:!border-indigo-500 rounded-xl" />
                </div>
            </div>

            <div class="flex flex-col gap-3">
                <label class="text-sm font-bold text-gray-300 uppercase tracking-wider">Ảnh đại diện</label>
                <div class="flex items-center gap-6 p-4 bg-[#0f172a] rounded-2xl border border-white/5">
                    <FileUpload 
                        mode="basic" 
                        name="avatar" 
                        accept="image/*" 
                        :maxFileSize="1000000" 
                        @select="onFileSelect"
                        auto
                        chooseLabel="Chọn ảnh"
                        class="!bg-white/10 hover:!bg-white/20 !border-0 !text-white"
                    />
                    <span v-if="fileName" class="text-sm text-indigo-400 font-medium truncate max-w-[200px]">{{ fileName }}</span>
                </div>
            </div>

            <div class="flex justify-center gap-6 mt-10">
                <Button 
                    type="button" 
                    label="Hủy" 
                    icon="pi pi-times" 
                    class="p-button-text !text-gray-400 hover:!text-white font-bold px-8"
                    @click="toggleEdit" 
                />
                <Button 
                    type="submit" 
                    label="Lưu thay đổi" 
                    icon="pi pi-check" 
                    class="p-button-raised !bg-indigo-600 hover:!bg-indigo-500 border-0 px-10 py-4 rounded-2xl font-bold transition-all transform hover:scale-105"
                    :loading="loading"
                />
            </div>
          </form>
        </template>
      </Card>
      
      <Card v-else class="shadow-2xl !bg-[#1e293b] border-0 rounded-[2rem]">
        <template #content>
          <div class="text-center py-20">
            <div class="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-8">
                <i class="pi pi-user-slash text-4xl text-gray-600"></i>
            </div>
            <p class="text-2xl text-gray-400 mb-10 font-bold">Bạn chưa đăng nhập</p>
            <Button 
                label="Đăng nhập ngay" 
                icon="pi pi-sign-in"
                class="p-button-raised !bg-indigo-600 hover:!bg-indigo-500 border-0 px-10 py-4 rounded-2xl font-bold transition-all"
                @click="router.push('/login')" 
            />
          </div>
        </template>
      </Card>
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
