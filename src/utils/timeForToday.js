export const timeForToday = (value) => {
    const now = new Date();
    const created = new Date(value);
    const diffSec = Math.floor((now - created) / 1000);

    if (diffSec < 0) return "";
    if (diffSec < 5)  return "방금 전";
    if (diffSec < 60) return `${diffSec}초 전`;

    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}분 전`;

    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}시간 전`;

    const Y = created.getFullYear();
    const M = String(created.getMonth() + 1).padStart(2, "0");
    const D = String(created.getDate()).padStart(2, "0");
    const h = String(created.getHours()).padStart(2, "0");
    const m = String(created.getMinutes()).padStart(2, "0");
    return `${Y}.${M}.${D} ${h}:${m}`;
}