/* eslint-disable no-bitwise */
/**
 * 랜덤 아바타 이미지 URL을 생성하는 유틸리티 함수
 * @param size 이미지 크기 (px)
 * @param id 고유 식별자 (선택사항, 동일한 ID는 동일한 이미지를 반환)
 * @returns 아바타 이미지 URL
 */
export function getAvatarUrl(size: number, id?: string | number): string {
  if (id !== undefined) {
    // ID를 숫자로 변환 (문자열 ID의 경우 해시값 사용)
    const numericId = typeof id === 'number' 
      ? id 
      : parseInt(id, 10) || Math.abs(hashCode(id));
    
    return `https://i.pravatar.cc/${size}?img=${numericId}`;
  }
  
  return `https://i.pravatar.cc/${size}`;
}

/**
 * 문자열을 숫자 해시코드로 변환
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

