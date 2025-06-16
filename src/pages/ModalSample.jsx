import React, { useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";


const ModalSample = () => {
    const [isDialogOpen1, setIsDialogOpen1] = useState(false);
    const [isDialogOpen2, setIsDialogOpen2] = useState(false);

    const handleDelete1 = () => {
        console.log("삭제 실행됨!");
        setIsDialogOpen1(false);
    };

    const handleDelete2 = () => {
        console.log("완료 실행됨!");
        setIsDialogOpen2(false);
    };

    return (
        <div>
            <h1>샘플 모달 페이지</h1>
            <button onClick={() => setIsDialogOpen1(true)}>확인, 취소 버튼</button>
            <button onClick={() => setIsDialogOpen2(true)}>확인 버튼</button>

            <ConfirmDialog
                isOpen={isDialogOpen1}
                title="댓글을 삭제하시겠습니까?"
                message="삭제된 댓글은 복구할 수 없습니다."
                onConfirm={handleDelete1}
                onCancel={() => setIsDialogOpen1(false)}
                showCancel={true}
                isRedButton={true}
            />

            <ConfirmDialog
                isOpen={isDialogOpen2}
                title="작성 완료!"
                // message="게시글이 성공적으로 등록되었습니다."
                onConfirm={handleDelete2}
                showCancel={false}
                isRedButton={false}
            />
        </div>
    );
}

export default ModalSample;