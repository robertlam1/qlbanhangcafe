const imageModules = import.meta.glob('../img/*.{png,jpg,jpeg,webp,gif,svg}', {
    eager: true
});

const baseName = (path) => {
    const name = path.split('/').pop() || '';
    return name.replace(/\.[^.]+$/, '');
};

/** Khóa = tên file không đuôi (vd: sp1.png → "sp1"), khớp với imageKey trong JSON */
export const imageMap = Object.fromEntries(
    Object.entries(imageModules).map(([path, mod]) => [baseName(path), mod.default])
);

export function resolveProductImage(imageKey) {
    if (imageKey == null || imageKey === '') return undefined;
    return imageMap[imageKey];
}
