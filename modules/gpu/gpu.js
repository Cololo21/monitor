export function renderGpuCard(gpu) {
    return template
        .replace('{{gpu_name}}', gpu.name)
        .replace('{{temp}}', gpu.temp)
        .replace('{{speed}}', gpu.speed);
}