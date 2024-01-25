@php
$Konversi = new \App\Helpers\Konversi; //panggil no static function
$Tanggal = new \App\Helpers\Tanggal; //panggil no static function

@endphp
<table>
    <tbody>
        <tr>
            <td colspan="9" style="font-weight:bold;text-align:center">DATA PENGGUNA</td>
        </tr>
        <tr>
            <td colspan="9" style="font-weight:bold;text-align:center">Waktu Export : {{date('d-m-Y H:i')}}</td>
        </tr>
    </tbody>
</table>
<table>
    <thead>
    <tr>
        <th style="font-weight:bold;text-align:center;background:#f4f4f4;border:1px solid #000000;">Nama</th> <!-- kolom A -->
        <th style="font-weight:bold;text-align:center;background:#f4f4f4;border:1px solid #000000;">Email</th> <!-- kolom B -->
        <th style="font-weight:bold;text-align:center;background:#f4f4f4;border:1px solid #000000;">Password</th> <!-- kolom C -->
        <th style="font-weight:bold;text-align:center;background:#f4f4f4;border:1px solid #000000;">Hak Akses</th> <!-- kolom D -->
      
    </tr>
    </thead>
    <tbody>
    @php $no=1; @endphp
    @if(count($data))
    @foreach($data as $dt)
        @php 
        $dbKategori=DB::table('users')->first();
        @endphp
        <tr>
            <td>{{$no++}}</td>
            <td>{{$dt->name??''}}</td>
            <td>{{$dt->email??''}}</td>
            <td>{{$dt->password??''}}</td>
            <td>{{$dt->namerole??''}}</td>
            
        </tr>
    @endforeach
    @endif
    </tbody>
</table>